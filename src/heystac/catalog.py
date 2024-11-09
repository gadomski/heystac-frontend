import datetime

from pydantic import ConfigDict, Field, field_serializer

from .provider import Provider
from .stac_object import StacObject


class Catalog(StacObject):
    model_config = ConfigDict(extra="allow")

    stac_version: str = Field(default="1.0.0")
    type_: str = Field(
        alias="type", serialization_alias="type", default="Catalog", frozen=True
    )
    id: str
    title: str
    description: str
    created: datetime.datetime | None = Field(default=None)
    updated: datetime.datetime | None = Field(default=None)
    license: str | None = Field(default=None)
    providers: list[Provider] | None = Field(default=None)

    @field_serializer("created")
    def serialize_created(self, created: datetime.datetime | None) -> str | None:
        if created:
            return created.isoformat()
        else:
            return None

    @field_serializer("updated")
    def serialize_updated(self, updated: datetime.datetime | None) -> str | None:
        if updated:
            return updated.isoformat()
        else:
            return None
