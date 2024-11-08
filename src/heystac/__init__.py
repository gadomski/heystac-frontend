import click

from .config import Config


@click.group()
def cli() -> None:
    pass


@click.command()
def prebuild() -> None:
    Config().prebuild()


cli.add_command(prebuild)


if __name__ == "__main__":
    cli()
