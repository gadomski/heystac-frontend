import datetime
import shutil
from pathlib import Path

import tqdm
from pydantic import BaseModel, Field
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
    TomlConfigSettingsSource,
)

from .catalog import Catalog
from .client import Client
from .collection import Collection
from .items import Items
from .link import Link
from .node import Node
from .provider import Provider
from .stac_object import StacObject


class Root(BaseModel):
    id: str
    title: str
    description: str
    created: datetime.datetime
    license: str
    providers: list[Provider]

    def to_catalog(self, links: list[Link]) -> Catalog:
        return Catalog(
            id=self.id,
            title=self.title,
            description=self.description,
            created=self.created.astimezone(tz=datetime.UTC).isoformat(),
            updated=datetime.datetime.now().astimezone(tz=datetime.UTC).isoformat(),
            license=self.license,
            providers=self.providers,
            links=links,
        )


class CatalogConfig(BaseModel):
    href: str
    title: str


class Config(BaseSettings):
    stac_path: Path = Field(alias="stac-path")
    root: Root
    url: str
    catalogs: dict[str, CatalogConfig]

    model_config = SettingsConfigDict(
        toml_file=Path(__file__).parents[2] / "config.toml"
    )

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ):
        return (TomlConfigSettingsSource(settings_cls),)

    def bootstrap(self) -> None:
        links = [
            Link(
                href=f"{self.url}/catalog.json",
                title="heystac",
                rel="self",
                type_="application/json",
            )
        ]
        for id, catalog_config in self.catalogs.items():
            links.append(
                Link(
                    href=f"./{id}/catalog.json",
                    title=catalog_config.title,
                    type_="application/json",
                    rel="child",
                    id=id,
                )
            )
        catalog = self.root.to_catalog(links)
        self.write_stac(catalog, "catalog.json")

    def crawl(self, id: str) -> None:
        client = Client()
        catalog = Catalog.model_validate(client.get(self.catalogs[id].href))
        catalog.id = id

        child_links = catalog.child_links()
        catalog.remove_structural_links()
        catalog.links.append(Link(href="../catalog.json", rel="root"))
        catalog.links.append(Link(href="../catalog.json", rel="parent"))

        progress_bar = tqdm.tqdm(total=len(child_links) * 2)
        if (self.stac_path / id).exists():
            shutil.rmtree(self.stac_path / id)
        for link in child_links:
            child = Collection.model_validate(client.get(link.href))
            progress_bar.update(1)

            items_link = child.items_link()
            child.remove_structural_links()
            catalog.links.append(
                Link(href=f"./{child.id}/collection.json", rel="child")
            )
            child.links.append(Link(href="../catalog.json", rel="parent"))
            child.links.append(Link(href="../../catalog.json", rel="root"))

            if items_link:
                items = Items.model_validate(
                    client.get(
                        items_link.href,
                        params=[("sortby", "-properties.datetime"), ("limit", 1)],
                    )
                )
                for item in items.features:
                    item.remove_structural_links()
                    child.links.append(Link(href=f"./{item.id}.json", rel="item"))
                    item.links.append(Link(href="../collection.json", rel="parent"))
                    item.links.append(Link(href="../collection.json", rel="collection"))
                    item.links.append(Link(href="../../../catalog.json", rel="root"))
                    self.write_stac(item, f"{id}/{child.id}/{item.id}.json")
            self.write_stac(child, f"{id}/{child.id}/collection.json")

            progress_bar.update(1)
        self.write_stac(catalog, f"{id}/catalog.json")

    def rate(self) -> None:
        with open(self.stac_path / "catalog.json") as f:
            catalog = Catalog.model_validate_json(f.read())
        node = Node(value=catalog)
        node.resolve(self.stac_path)
        node.rate()
        node.write_to(self.stac_path)

    def write_stac(self, stac_object: StacObject, subpath: str) -> None:
        path = Path(__file__).parents[2] / self.stac_path / subpath
        if not path.parent.exists():
            path.parent.mkdir(parents=True)
        with open(path, "w") as f:
            f.write(stac_object.to_json())
