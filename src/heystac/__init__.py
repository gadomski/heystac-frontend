import sys

import click

from .config import Config


@click.group()
def cli() -> None:
    """Command-line interface for heystac"""
    pass


@click.command()
def bootstrap() -> None:
    """Build catalog.json from our config.

    Shouldn't need to be run very often.
    """
    Config().bootstrap()


@click.command()
@click.argument("id", default=None)
@click.option("--all", is_flag=True, help="Crawl every catalog")
def crawl(id: str | None, all: bool) -> None:
    """Crawl a STAC API.

    We don't crawl every API because that'd be expensive.
    """
    config = Config()
    if id is None:
        if all:
            for id in config.catalogs.keys():
                config.crawl(id)
        else:
            print(
                "To crawl every catalog, pass the --all flag",
                file=sys.stderr,
            )
            sys.exit(1)
    else:
        config.crawl(id)


@click.command()
def rate() -> None:
    """Rate everything."""
    Config().rate()


cli.add_command(crawl)
cli.add_command(bootstrap)
cli.add_command(rate)


if __name__ == "__main__":
    cli()
