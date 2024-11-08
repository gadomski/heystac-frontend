from typing import Any

from requests import Session


class Client:
    def __init__(self):
        self.session = Session()

    def get(
        self, url: str, params: list[tuple[str, Any]] | None = None
    ) -> dict[str, Any]:
        response = self.session.get(url, params=params)
        response.raise_for_status()
        return response.json()
