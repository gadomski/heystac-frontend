"use client";

import { Heading, Lead } from "@devseed-ui/typography";
import Catalog from "../stac/catalog.json";
import CatalogsCard from "./components/card/catalog";

export default function Home() {
  // TODO: Use Catalog type
  let catalogs = Catalog["links"].filter(link => link["rel"] == "child");
  return (
    <div className="h-full grid grid-cols-1 text-center content-center">
      <div className="my-8">
        <Heading className="py-2" size="jumbo">
          heystac
        </Heading>

        <Lead>A curated geospatial asset discovery experience™</Lead>
      </div>

      <CatalogsCard catalogs={catalogs}></CatalogsCard>
    </div>
  );
}
