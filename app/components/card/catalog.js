import Card from "./base";

export default function CatalogsCard({ catalogs }) {
  let catalogList = catalogs.map((catalog) => {
    return (
      <li className="py-2" key={catalog.href}>
        {catalog.title}
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
