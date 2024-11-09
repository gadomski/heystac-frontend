from pydantic import BaseModel, ConfigDict, Field

from .stac_object import Check, StacObject


class Properties(BaseModel):
    model_config = ConfigDict(extra="allow")

    rating: int | None = Field(
        default=None, alias="heystac:rating", serialization_alias="heystac:rating"
    )
    total: int | None = Field(
        default=None, alias="heystac:total", serialization_alias="heystac:total"
    )
    stars: float | None = Field(
        default=None, alias="heystac:stars", serialization_alias="heystac:stars"
    )
    checks: list[Check] | None = Field(
        default=None, alias="heystac:checks", serialization_alias="heystac:checks"
    )


class Item(StacObject):
    model_config = ConfigDict(extra="allow")

    id: str
    properties: Properties

    def set_rating(self, rating: int, total: int, checks: list[Check]) -> None:
        self.properties.rating = rating
        self.properties.total = total
        self.properties.stars = 5 * rating / total
        self.properties.checks = checks
