import Link from "next/link";
import { Heading, Subtitle, Prose } from "../typography";
import { use } from "react";
import { CollecticonExpandTopRight } from "@devseed-ui/collecticons-react";

export default function CatalogPage({ title, href }) {
  let data = use(fetch(href));
  let catalog = use(data.json());
  return (
    <div className="mx-8 my-4">
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

      <Prose></Prose>
    </div>
  );
}
