import Catalog from "../../catalog";
import { use } from "react";

export default function CatalogPage({ params }) {
  let { id } = use(params);
  let link = Catalog["links"].find((link) => link["heystac:id"] == id);
  let data = use(fetch(link.href));
  let catalog = use(data.json());
  return (
    <div className="flex mx-8 my-4">
      <h1 className="text-2xl flex-auto">{link.title}</h1>

      <p className="">STAC version {catalog["stac_version"]}</p>
    </div>
  );
}
