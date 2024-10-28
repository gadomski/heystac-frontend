import Link from "next/link";
import { Heading, Subtitle } from "../typography";
import { use } from "react";
import { CollecticonExpandTopRight } from "@devseed-ui/collecticons-react";
import Map from "../map";

export default function CatalogPage({ title, href }) {
  let data = use(fetch(href));
  let catalog = use(data.json());
  return (
    <div className="px-8 py-4 grid grid-cols-1 grid-rows-[auto,1fr] gap-4 h-full">
      <div>
        <Heading>
          <div className="flex items-center">
            {title}
            <span className="mx-2">
              <Link href={href}>
                <CollecticonExpandTopRight></CollecticonExpandTopRight>
              </Link>
            </span>
          </div>
        </Heading>
        <Subtitle>STAC version {catalog["stac_version"]}</Subtitle>
      </div>
      <Map {...{ id: "stac-map", center: [-105, 39.7373], zoom: 2 }}></Map>
    </div>
  );
}
