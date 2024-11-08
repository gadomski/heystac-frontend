import click

from .config import Config


@click.group()
def cli() -> None:
    """Command-line interface for heystac"""
    pass


@click.command()
def bootstrap() -> None:
    """Build our catalog from scratch"""
    Config().bootstrap()


@click.command()
@click.argument("id")
def crawl(id: str) -> None:
    """Crawl a STAC API"""
    Config().crawl(id)


@click.command()
def rate() -> None:
    """Rate everything in our catalog"""
    Config().rate()


cli.add_command(crawl)
cli.add_command(bootstrap)
cli.add_command(rate)


if __name__ == "__main__":
    cli()
