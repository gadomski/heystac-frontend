import Catalog from "../../catalog";
import { use } from "react";

export default function CatalogPage({ params }) {
  let { id } = use(params);
  let link = Catalog["links"].find((link) => link["heystac:id"] == id);
  let data = use(fetch(link.href));
  let catalog = use(data.json());
  return (
    <div>
      <h1>{link.title}</h1>
    </div>
  );
}
