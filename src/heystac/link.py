from pydantic import BaseModel, Field


class Link(BaseModel):
    href: str
    title: str | None = Field(default=None)
    rel: str
    type_: str | None = Field(alias="type", default=None)
    id: str | None = Field(alias="heystac:id", default=None)
