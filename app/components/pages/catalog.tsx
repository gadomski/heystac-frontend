import Link from "next/link";
import { Catalog, Collection } from "../../types/Stac";
import { Stars } from "../stars";
import { Heading, Lead, Prose, Subtitle } from "../typography";

function CollectionCard({
  catalogId,
  collection,
}: {
  catalogId: string;
  collection: Collection;
}) {
  return (
    <div className="flex">
      <Link href={"/catalogs/" + catalogId + "/collections/" + collection.id}>
        {collection.title}{" "}
      </Link>
      <Stars stars={collection["heystac:stars"] || 0}></Stars>
    </div>
  );
}

export default function CatalogPage({
  catalog,
  collections,
  title,
}: {
  catalog: Catalog;
  collections: Collection[];
  title: string;
}) {
  const collectionCards = collections
    .sort((a, b) => (b["heystac:stars"] || 0) - (a["heystac:stars"] || 0))
    .map(collection => CollectionCard({ catalogId: catalog.id, collection }));
  return (
    <div className="px-8 py-4 grid grid-cols-1 md:grid-cols-[320px,1fr] md:grid-rows-[auto,1fr] grid-rows-[auto,1fr,1fr] gap-4 h-full">
      <div className="row-span-1 col-span-2">
        <Heading>
          <div className="flex items-center">{title}</div>
        </Heading>
        <Subtitle>STAC version {catalog["stac_version"]}</Subtitle>
      </div>

      <div className="row-start-2 col-start-1 p-4">
        <Lead>{catalog.description}</Lead>
        <div className="flex justify-center my-4 text-slate-400">
          <Prose>
            <Stars stars={catalog["heystac:stars"] || 0}></Stars>
          </Prose>
        </div>
      </div>

      <div className="row-start-3 col-start-1 md:col-start-2 md:row-start-2">
        {collectionCards}
      </div>
    </div>
  );
}
