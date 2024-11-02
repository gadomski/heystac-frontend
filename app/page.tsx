"use client";

import CatalogsCard from "./components/card/catalog";
import Catalog from "./catalog.json";
import { Heading, Text } from "@chakra-ui/react";

export default function Home() {
  // TODO: Use Catalog type
  let catalogs = Catalog["links"].filter(link => link["rel"] == "child");
  return (
    <div className="h-full grid grid-cols-1 text-center content-center">
      <div className="my-8">
        <Heading className="py-2" size="3xl">
          heystac
        </Heading>

        <Text>A curated geospatial asset discovery experience™</Text>
      </div>

      <CatalogsCard catalogs={catalogs}></CatalogsCard>
    </div>
  );
}
