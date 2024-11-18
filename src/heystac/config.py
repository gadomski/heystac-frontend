from __future__ import annotations

from pathlib import Path

from pydantic import BaseModel, ConfigDict
from pydantic_settings import (
    BaseSettings,
    PydanticBaseSettingsSource,
    SettingsConfigDict,
    TomlConfigSettingsSource,
)

from .catalog import Catalog
from .node import Node
from .rate import Rater, Rule, Weights


class Config(BaseSettings):
    """heystac configuration"""

    model_config = SettingsConfigDict(env_prefix="heystac_", toml_file="heystac.toml")

    catalog: LocalCatalogConfig
    root: Catalog
    catalogs: dict[str, RemoteCatalogConfig]
    rules: dict[str, Rule]
    weights: Weights

    @classmethod
    def settings_customise_sources(
        cls,
        settings_cls: type[BaseSettings],
        init_settings: PydanticBaseSettingsSource,
        env_settings: PydanticBaseSettingsSource,
        dotenv_settings: PydanticBaseSettingsSource,
        file_secret_settings: PydanticBaseSettingsSource,
    ) -> tuple[PydanticBaseSettingsSource, ...]:
        return (TomlConfigSettingsSource(settings_cls),)

    def get_root_node(self) -> Node:
        if (catalog_path := self.catalog.path / "catalog.json").exists():
            return Node.read_from(catalog_path)
        else:
            return Node(self.root)

    def get_rater(self, exclude: list[str] | None = None) -> Rater:
        if exclude:
            rules = {id: rule for id, rule in self.rules.items() if id not in exclude}
        else:
            rules = self.rules
        return Rater(rules=rules, weights=self.weights)


class LocalCatalogConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    path: Path


class RemoteCatalogConfig(BaseModel):
    model_config = ConfigDict(extra="forbid")

    href: str
    title: str
