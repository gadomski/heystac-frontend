import Link from "next/link";
import { use } from "react";
import { CollecticonExpandTopRight } from "@devseed-ui/collecticons-chakra";

import Map from "../map";
import { Heading, Text } from "@chakra-ui/react";

export default function CatalogPage({ title, href }) {
  const data = use(fetch(href));
  const catalog = use(data.json());

  return (
    <div className="px-8 py-4 grid grid-cols-1 md:grid-cols-[320px,1fr] md:grid-rows-[auto,1fr] grid-rows-[auto,1fr,1fr] gap-4 h-full">
      <div className="row-span-1 col-span-2">
        <Heading>
          <div className="flex items-center">
            {title}
            <span className="mx-2">
              <Link href={href}>{/*  */}</Link>
              {/* This throws a React error " React.Children.only expected to receive a single React element child."
              <CollecticonExpandTopRight /> */}
            </span>
          </div>
        </Heading>
        <Text>STAC version {catalog["stac_version"]}</Text>
      </div>

      <div className="row-start-2 col-start-1 border border-gray-200 p-4">
        Placeholder for your content
      </div>

      <div className="row-start-3 col-start-1 md:col-start-2 md:row-start-2">
        <Map center={[-105, 39.7373]} zoom={2} />
      </div>
    </div>
  );
}
