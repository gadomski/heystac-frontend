import { notFound } from "next/navigation";
import { use } from "react";
import CollectionsPage from "../../../components/pages/collections";
import Root from "../../../stac/catalog.json";
import type { Catalog, Collection } from "../../../types/Stac";

type Params = { id: string };

export default function Page({ params }) {
  const { id } = use(params) as Params;
  const link = Root["links"].find(link => link["heystac:id"] == id);
  if (!link) {
    notFound();
  }
  const catalog: Catalog = use(import("../../../stac/" + id + "/catalog.json"));
  const collections = catalog.links
    .filter(link => link.rel == "child")
    .map(link => {
      const collection: Collection = use(
        import("../../../stac/" + id + link.href.substring(1))
      );
      return collection;
    });
  return (
    <CollectionsPage
      catalog={catalog}
      collections={collections}
      title={link.title}
    ></CollectionsPage>
  );
}

export async function generateStaticParams() {
  const stac_catalog: Catalog = Root;
  return stac_catalog.links.map(link => ({
    id: link["heystac:id"],
  }));
}
