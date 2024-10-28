import Card from "./base";
import Link from "next/link";

export default function CatalogsCard({ catalogs }) {
  let catalogList = catalogs.map((catalog) => {
    return (
      <li className="py-2" key={catalog.href}>
        <Link href={"/catalogs/" + catalog["heystac:id"]}>{catalog.title}</Link>
      </li>
    );
  });
  return (
    <Card
      heading={"Catalogs"}
      subtitle={"A hand-picked list of quality STAC APIs"}
    >
      <ul>{catalogList}</ul>
    </Card>
  );
}
