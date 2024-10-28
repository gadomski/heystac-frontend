import CatalogsCard from "./components/card/catalog";
import Catalog from "./catalog";

export default function Home() {
  let catalogs = Catalog["links"].filter((link) => link["rel"] == "child");
  return (
    <div className="h-screen content-center grid grid-cols-3 mx-16">
      <h1 className="col-span-3 text-center">heystac</h1>

      <p className="col-span-3 text-center">
        A curated geospatial asset discovery experience™
      </p>

      <CatalogsCard catalogs={catalogs}></CatalogsCard>
    </div>
  );
}
