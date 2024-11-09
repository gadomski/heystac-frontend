from pydantic import BaseModel, Field


class Link(BaseModel):
    href: str
    title: str | None = Field(default=None)
    rel: str
    type_: str | None = Field(serialization_alias="type", default=None)
    id: str | None = Field(serialization_alias="heystac:id", default=None)
