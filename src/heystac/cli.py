import json
import sys
import urllib.parse
from pathlib import Path

import click
import httpx
import tabulate
from click import Context

from .check import Check
from .config import Config
from .crawl import Crawler
from .stac_object import StacObject


@click.group()
@click.pass_context
def cli(ctx: Context) -> None:
    """Crawl and rate STAC catalogs"""
    ctx.ensure_object(dict)
    ctx.obj["config"] = Config()


@click.command()
@click.argument("catalog")
@click.argument(
    "outdir", required=False, type=click.Path(file_okay=False, path_type=Path)
)
@click.option(
    "-f",
    "--rewrite",
    is_flag=True,
    help="Remove target directories before re-writing data",
)
@click.pass_context
def crawl(ctx: Context, catalog: str, outdir: Path | None, rewrite: bool) -> None:
    """Crawl a STAC catalog or API and save it to the local filesystem.

    The catalog can be provided as a href or the id of a catalog in the config.
    If the output path is not provided, the configured path will be used.
    """
    config: Config = ctx.obj["config"]
    if catalog_config := config.catalogs.get(catalog):
        crawler = Crawler(
            href=catalog_config.href, title=catalog_config.title, id=catalog
        )
    else:
        crawler = Crawler(href=catalog, title=None, id=None)
    node = crawler.crawl()
    node.remove_structural_links()
    if outdir:
        node.write_to(outdir, rewrite=rewrite)
    else:
        root = config.get_root_node()
        root.add_or_replace_child(node)
        root.write_to(config.catalog.path, rewrite=rewrite)


@click.command()
@click.argument("href")
@click.pass_context
def rate(ctx: Context, href: str) -> None:
    """Rate a STAC object"""
    config: Config = ctx.obj["config"]

    url = urllib.parse.urlparse(href)
    if url.scheme:
        response = httpx.get(href)
        response.raise_for_status()
        data = response.json()
    else:
        with open(href) as f:
            data = json.load(f)

    if isinstance(data, dict):
        stac_object = StacObject.from_dict(data)
    else:
        print(f"ERROR: json is not a dictionary: {href}", file=sys.stderr)
        sys.exit(1)
    stac_object = StacObject.from_dict(data)

    rater = config.get_rater()
    rating = rater.rate(stac_object)
    stars = rating.get_stars()
    print(f"{stars:.1f} " + "\u2605" * round(stars))
    issues = rating.get_issues()

    def print_issue_table(name: str, issues: list[Check]) -> None:
        if not issues:
            return
        table = [[check.rule_id, check.message] for check in issues]
        print()
        print(f"{name} importance issues")
        print(
            tabulate.tabulate(table, tablefmt="pretty", headers=["Rule id", "Message"])
        )

    print_issue_table("High", issues.high)
    print_issue_table("Medium", issues.medium)
    print_issue_table("Low", issues.low)


@click.command
@click.option(
    "-x",
    "--exclude",
    help="Rules to exclude",
    default=[],
    show_default=True,
    multiple=True,
)
@click.pass_context
def rate_catalog(ctx: Context, exclude: list[str]) -> None:
    """Rate heystac's whole local catalog and write the results back into the STAC values."""
    config: Config = ctx.obj["config"]
    node = config.get_root_node()
    rater = config.get_rater(exclude=exclude)
    rater.rate_node(node)
    node.remove_structural_links()
    node.write_to(config.catalog.path)


cli.add_command(crawl)
cli.add_command(rate)
cli.add_command(rate_catalog)

if __name__ == "__main__":
    cli()
