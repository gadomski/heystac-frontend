from pydantic import BaseModel

from .item import Item


class Items(BaseModel):
    features: list[Item]
