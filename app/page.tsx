import Link from "next/link";
import { use } from "react";
import { Rating, Stars } from "./components/stars";
import { Heading, Lead, Subtitle } from "./components/typography";
import Root from "./stac/catalog.json";
import { Catalog, Link as StacLink } from "./types/Stac";

function getCatalog({ link }: { link: StacLink }): Catalog {
  return use(import("./stac/" + link["heystac:id"] + "/catalog.json"));
}

function CatalogListItem({ catalog }: { catalog: Catalog }) {
  return (
    <li className="py-2" key={catalog.id}>
      <Link href={"/catalogs/" + catalog.id + "/collections"}>
        {catalog.title}
      </Link>
      <div className="text-slate-400 grid my-1 grid-cols-1 justify-items-center">
        <div className="">
          <Stars stars={catalog["heystac:stars"] || 0}></Stars>
        </div>
        <div>
          <Rating stars={catalog["heystac:stars"] || 0}></Rating>
        </div>
      </div>
    </li>
  );
}

export default function Home() {
  let catalogs = Root["links"]
    .filter(link => link["rel"] == "child")
    .map(link => getCatalog({ link }));
  catalogs.sort(
    (a, b) => (b["heystac:stars"] || 0) - (a["heystac:stars"] || 0)
  );
  let catalogListItems = catalogs.map(catalog => (
    <CatalogListItem catalog={catalog} key={catalog.id}></CatalogListItem>
  ));
  return (
    <div className="h-full grid grid-cols-1 text-center content-center">
      <div className="my-8">
        <Heading className="py-2" size="jumbo">
          heystac
        </Heading>

        <Lead>A curated geospatial asset discovery experience™</Lead>
      </div>

      <div>
        <Heading>Catalogs</Heading>
        <Subtitle>A hand-picked list of quality STAC APIs</Subtitle>

        <ul className="my-4">{catalogListItems}</ul>
      </div>
    </div>
  );
}
