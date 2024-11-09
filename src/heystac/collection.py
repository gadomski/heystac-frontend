from pydantic import ConfigDict, Field

from .stac_object import StacObject


class Collection(StacObject):
    model_config = ConfigDict(extra="allow")

    type_: str = Field(alias="type", default="Collection", frozen=True)
    id: str
