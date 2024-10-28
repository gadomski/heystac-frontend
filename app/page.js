import CatalogsCard from "./components/card/catalog";
import Catalog from "./catalog";

export default function Home() {
  let catalogs = Catalog["links"].filter((link) => link["rel"] == "child");
  return (
    <div className="h-screen grid grid-cols-3 text-center content-center">
      <h1 className="text-5xl col-start-2 py-2">heystac</h1>

      <p className="col-start-2 font-light">
        A curated geospatial asset discovery experience™
      </p>

      <CatalogsCard catalogs={catalogs}></CatalogsCard>
    </div>
  );
}
