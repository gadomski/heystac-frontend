import { Catalog, Collection } from "../../types/Stac";
import Map from "../map";
import { Heading, Subtitle } from "../typography";

export default function CollectionsPage({
  catalog,
  collections,
  title,
}: {
  catalog: Catalog;
  collections: Collection[];
  title: string;
}) {
  return (
    <div className="px-8 py-4 grid grid-cols-1 md:grid-cols-[320px,1fr] md:grid-rows-[auto,1fr] grid-rows-[auto,1fr,1fr] gap-4 h-full">
      <div className="row-span-1 col-span-2">
        <Heading>
          <div className="flex items-center">
            {title}
            <span className="mx-2"></span>
          </div>
        </Heading>
        <Subtitle>STAC version {catalog["stac_version"]}</Subtitle>
      </div>

      <div className="row-start-2 col-start-1 p-4"></div>

      <div className="row-start-3 col-start-1 md:col-start-2 md:row-start-2">
        <Map center={[-105, 39.7373]} zoom={2} />
      </div>
    </div>
  );
}
