from __future__ import annotations

import json
from pathlib import Path

from pydantic import BaseModel, Field

from .catalog import Catalog
from .collection import Collection
from .item import Item


class Node(BaseModel):
    value: Catalog | Collection
    children: list[Node] = Field(default_factory=list)
    items: list[Item] = Field(default_factory=list)

    @classmethod
    def read_from(cls, path: Path) -> Node:
        with open(path) as f:
            data = json.load(f)
        if data["type"] == "Catalog":
            value: Catalog | Collection = Catalog.model_validate(data)
        elif data["type"] == "Collection":
            value = Collection.model_validate(data)
        else:
            raise Exception(f"unexpected node type: {data['type']}")
        return Node(value=value)

    def rate(self) -> None:
        cumulative_rating = 0
        cumulative_total = 0
        for child in self.children:
            child.rate()
            cumulative_rating += child.value.cumulative_rating or 0
            cumulative_total += child.value.cumulative_total or 0
        for item in self.items:
            item.rate()
            cumulative_rating += item.properties.rating or 0
            cumulative_total += item.properties.total or 0
        self.value.rate()
        self.value.cumulative_rating = self.value.rating or 0 + cumulative_rating
        self.value.cumulative_total = self.value.total or 0 + cumulative_total
        self.value.stars = (
            5 * self.value.cumulative_rating / self.value.cumulative_total
        )

    def resolve(self, directory: Path) -> None:
        for link in self.value.links:
            if link.rel == "child":
                path = (directory / link.href).resolve()
                node = Node.read_from(path)
                node.resolve(path.parent)
                self.children.append(node)
            elif link.rel == "item":
                path = (directory / link.href).resolve()
                with open(path) as f:
                    item = Item.model_validate_json(f.read())
                self.items.append(item)

    def write_to(self, directory: Path) -> None:
        file_name = f"{self.value.type_.lower()}.json"
        with open(directory / file_name, "w") as f:
            f.write(self.value.to_json())
        for child in self.children:
            child.write_to(directory / child.value.id)
        for item in self.items:
            with open(directory / f"{item.id}.json", "w") as f:
                f.write(item.to_json())
