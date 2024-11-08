import click

from .config import Config


@click.group()
def cli() -> None:
    """Command-line interface for heystac"""
    pass


@click.command()
def prebuild() -> None:
    """Build our catalog"""
    Config().prebuild()


@click.command()
@click.argument("id")
def crawl(id: str) -> None:
    """Crawl a STAC API"""
    Config().crawl(id)


cli.add_command(crawl)
cli.add_command(prebuild)


if __name__ == "__main__":
    cli()
