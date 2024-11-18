from pydantic import Field

from .rating import Rating
from .stac_object import StacObject


class Catalog(StacObject):
    """A STAC catalog"""

    type: str = Field(default="Catalog")
    title: str | None = Field(default=None)
    rating: Rating | None = Field(default=None, alias="heystac:rating")

    def get_file_name(self) -> str:
        return "catalog.json"

    def set_rating(self, rating: Rating) -> None:
        self.rating = rating
