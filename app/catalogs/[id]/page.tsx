import CatalogPage from "../../components/pages/catalog";
import Catalog from "../../catalog.json";
import { use } from "react";
import { notFound } from "next/navigation";

interface Catalog {
  type: string;
  stac_version: string;
  id: string;
  description: string;
  links: Link[];
}

type LinkIdObject = { id: string };

interface Link {
  href: string;
  rel: string;
  type: string;
  title: string;
  "heystac:id": string;
}

export default function Page({ params }) {
  let { id } = use(params) as LinkIdObject;
  let link = Catalog["links"].find(link => link["heystac:id"] == id);
  if (!link) {
    notFound();
  }
  return <CatalogPage href={link.href} title={link.title}></CatalogPage>;
}

export async function generateStaticParams() {
  const stac_catalog: Catalog = Catalog;
  return stac_catalog.links.map(link => ({
    id: link["heystac:id"],
  }));
}
