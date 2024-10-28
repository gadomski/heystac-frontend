"use client";

import { Heading, Lead } from "@devseed-ui/typography";
import { DevseedUiThemeProvider } from "@devseed-ui/theme-provider";
import CatalogsCard from "./components/card/catalog";
import Catalog from "./catalog";

export default function Home() {
  let catalogs = Catalog["links"].filter((link) => link["rel"] == "child");
  return (
    <DevseedUiThemeProvider>
      <div className="h-screen content-center grid grid-cols-3 mx-16">
        <Heading className="col-span-3 text-center">heystac</Heading>

        <Lead className="col-span-3 text-center">
          A curated geospatial asset discovery experience™
        </Lead>

        <CatalogsCard catalogs={catalogs}></CatalogsCard>
      </div>
    </DevseedUiThemeProvider>
  );
}
