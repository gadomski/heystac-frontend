import assert from "assert";
import { use } from "react";
import { Catalog, Collection } from "./types/Stac";

export function getCatalog(id: string): Catalog {
  return use(import("./stac/" + id + "/catalog.json"));
}

export function getCollections(catalog: Catalog): Collection[] {
  return catalog.links
    .filter(link => link.rel == "child")
    .map(link => {
      assert(link.href.startsWith("./"));
      const collection: Collection = use(
        import("./stac/" + catalog.id + link.href.substring(1))
      );
      return collection;
    });
}
