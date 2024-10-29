import CatalogPage from "../../components/pages/catalog";
import Catalog from "../../catalog.json";
import { use } from "react";
import { notFound } from "next/navigation";
import type { Catalog as Stac } from "../../types/Stac";

type Params = { id: string };

export default function Page({ params }) {
  const { id } = use(params) as Params;
  const link = Catalog["links"].find(link => link["heystac:id"] == id);
  if (!link) {
    notFound();
  }
  return <CatalogPage href={link.href} title={link.title}></CatalogPage>;
}

export async function generateStaticParams() {
  const stac_catalog: Stac = Catalog;
  return stac_catalog.links.map(link => ({
    id: link["heystac:id"],
  }));
}
