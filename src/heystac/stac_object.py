from __future__ import annotations

from typing import Any

import pystac.validation
from pydantic import BaseModel, Field
from pystac.errors import STACValidationError

from .link import Link

STRUCTURAL_RELS = ["root", "parent", "child", "collection", "self"]


class Check(BaseModel):
    name: str
    rating: int
    total: int
    message: str | None = Field(default=None)

    @classmethod
    def validate_core(cls, stac_dict: dict[str, Any]) -> Check:
        rating = 1
        message = None
        try:
            pystac.validation.validate_dict(stac_dict, extensions=[])
        except STACValidationError as e:
            rating = 0
            message = str(e)
        return Check(name="validate-core", rating=rating, total=1, message=message)


class StacObject(BaseModel):
    links: list[Link]
    rating: int | None = Field(
        default=None, alias="heystac:rating", serialization_alias="heystac:rating"
    )
    cumulative_rating: int | None = Field(
        default=None,
        alias="heystac:cumulative_rating",
        serialization_alias="heystac:cumulative_rating",
    )
    total: int | None = Field(
        default=None, alias="heystac:total", serialization_alias="heystac:total"
    )
    cumulative_total: int | None = Field(
        default=None,
        alias="heystac:cumulative_total",
        serialization_alias="heystac:cumulative_total",
    )
    stars: float | None = Field(
        default=None, alias="heystac:stars", serialization_alias="heystac:stars"
    )
    checks: list[Check] | None = Field(
        default=None, alias="heystac:checks", serialization_alias="heystac:checks"
    )

    def rate(self) -> None:
        stac_dict = self.to_dict()
        checks = [Check.validate_core(stac_dict)]
        rating = 0
        total = 0
        for check in checks:
            rating += check.rating
            total += check.total
        self.set_rating(rating, total, checks)

    def set_rating(self, rating: int, total: int, checks: list[Check]) -> None:
        self.rating = rating
        self.total = total
        self.stars = 5 * rating / total
        self.checks = checks

    def to_json(self) -> str:
        return self.model_dump_json(indent=2, by_alias=True, exclude_none=True)

    def to_dict(self) -> dict[str, Any]:
        return self.model_dump(by_alias=True, exclude_none=True)

    def child_links(self) -> list[Link]:
        return [link for link in self.links if link.rel == "child"]

    def items_link(self) -> Link | None:
        return next((link for link in self.links if link.rel == "items"), None)

    def remove_structural_links(self) -> None:
        self._set_canonical_link()
        self.links = [link for link in self.links if link.rel not in STRUCTURAL_RELS]

    def _set_canonical_link(self) -> None:
        self_link = next((link for link in self.links if link.rel == "self"), None)
        if self_link:
            self.links.append(self_link.model_copy(update={"rel": "canonical"}))
