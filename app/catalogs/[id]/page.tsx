import { notFound } from "next/navigation";
import { use } from "react";
import Root from "../../../stac/catalog.json";
import CatalogPage from "../../components/pages/catalog";
import type { Catalog } from "../../types/Stac";

type Params = { id: string };

export default function Page({ params }) {
  const { id } = use(params) as Params;
  const link = Root["links"].find(link => link["heystac:id"] == id);
  if (!link) {
    notFound();
  }
  const catalog: Catalog = use(import("../../../stac/" + id + "/catalog.json"));
  return <CatalogPage catalog={catalog} title={link.title}></CatalogPage>;
}

export async function generateStaticParams() {
  const stac_catalog: Catalog = Root;
  return stac_catalog.links.map(link => ({
    id: link["heystac:id"],
  }));
}
