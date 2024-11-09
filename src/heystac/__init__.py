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
@click.argument("id")
def crawl(id: str) -> None:
    """Crawl a STAC API.

    If id == "all" then we'll crawl all the catalogs — this could take a while.
    """
    config = Config()
    if id == "all":
        for id in config.catalogs.keys():
            config.crawl(id)
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
