"use client";

import CatalogsCard from "./components/card/catalog";
import Catalog from "./catalog";
import { Heading, Lead } from "@devseed-ui/typography";

export default function Home() {
  let catalogs = Catalog["links"].filter((link) => link["rel"] == "child");
  return (
    <div className="h-screen grid grid-cols-1 text-center content-center">
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
