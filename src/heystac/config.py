from __future__ import annotations

import datetime
import json
from pathlib import Path
from typing import Any

import requests
import tqdm
from pydantic import BaseModel, Field
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
    TomlConfigSettingsSource,
)


class Node(BaseModel):
    value: dict[str, Any]
    children: list[Node]
    items: list[dict[str, Any]]

    def write_to(self, path: Path) -> None:
        # TODO set up the links correctly

        if not path.exists():
            path.mkdir(parents=True)
        type_ = self.value["type"]
        assert isinstance(type_, str)
        file_name = type_.lower() + ".json"
        with open(path / file_name, "w") as f:
            json.dump(self.value, f, indent=2)
        for child in self.children:
            id = child.value["id"]
            assert isinstance(id, str)
            child.write_to(path / id)
        for item in self.items:
            id = item["id"]
            assert isinstance(id, str)
            file_name = id + ".json"
            with open(path / file_name, "w") as f:
                json.dump(item, f, indent=2)


class Root(BaseModel):
    id: str
    title: str
    description: str
    created: datetime.datetime
    license: str


class Catalog(BaseModel):
    href: str
    title: str


class Config(BaseSettings):
    stac_path: Path = Field(alias="stac-path")
    url: str
    root: Root
    catalogs: dict[str, Catalog]

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

    def prebuild(self) -> None:
        links = [
            {
                "href": f"{self.url}/catalog.json",
                "title": "heystac",
                "rel": "self",
                "type": "application/json",
            }
        ]
        for id_, catalog in self.catalogs.items():
            links.append(
                {
                    "href": f"./{id_}/catalog.json",
                    "title": catalog.title,
                    "type": "application/json",
                    "rel": "child",
                    "heystac:id": id_,
                }
            )
        catalog_dict = {
            "stac_version": "1.1.0",
            "type": "Catalog",
            "id": self.root.id,
            "title": self.root.title,
            "description": self.root.description,
            "created": self.root.created.astimezone(tz=datetime.UTC).isoformat(),
            "updated": datetime.datetime.now().astimezone(tz=datetime.UTC).isoformat(),
            "license": self.root.license,
            "providers": [
                {
                    "name": "Pete Gadomski",
                    "roles": ["licensor", "producer", "processor"],
                    "url": self.url,
                }
            ],
            "links": links,
        }
        stac_path = self._stac_path()
        with open(stac_path / "catalog.json", "w") as f:
            json.dump(catalog_dict, f, indent=2)

    def crawl(self, id: str) -> None:
        response = requests.get(self.catalogs[id].href)
        response.raise_for_status()
        catalog = response.json()
        child_links = [link for link in catalog["links"] if link["rel"] == "child"]
        node = Node(value=catalog, children=[], items=[])
        progress_bar = tqdm.tqdm(total=len(child_links) * 2)
        for link in child_links:
            response = requests.get(link["href"])
            response.raise_for_status()
            child = response.json()
            progress_bar.update(1)
            items_link = next(
                (link for link in child["links"] if link["rel"] == "items"), None
            )
            child_node = Node(value=child, children=[], items=[])
            if items_link:
                response = requests.get(
                    items_link["href"],
                    params=[("sortby", "-properties.datetime"), ("limit", 1)],
                )
                response.raise_for_status()
                items = response.json()
                child_node.items.extend(items["features"])
            node.children.append(child_node)
            progress_bar.update(1)

        node.write_to(self._stac_path() / id)

    def _stac_path(self) -> Path:
        stac_path = Path(__file__).parents[2] / self.stac_path
        if not stac_path.exists():
            stac_path.mkdir(parents=True)
        return stac_path
