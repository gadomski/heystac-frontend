import CatalogPage from "../../components/pages/catalog";
import Catalog from "../../catalog";
import { use } from "react";
import { notFound } from "next/navigation";

export default function Page({ params }) {
  let { id } = use(params);
  let link = Catalog["links"].find((link) => link["heystac:id"] == id);
  if (!link) {
    notFound();
  }
  return <CatalogPage href={link.href} title={link.title}></CatalogPage>;
}
