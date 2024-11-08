import datetime
import json
from pathlib import Path

from pydantic import BaseModel, Field
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
    TomlConfigSettingsSource,
)


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
                    "href": catalog.href,
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
        stac_path = Path(__file__).parents[2] / self.stac_path
        if not stac_path.exists():
            stac_path.mkdir(parents=True)
        with open(stac_path / "catalog.json", "w") as f:
            json.dump(catalog_dict, f)
