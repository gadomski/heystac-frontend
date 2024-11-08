from pydantic import BaseModel


class Provider(BaseModel):
    name: str
    roles: list[str]
    url: str
