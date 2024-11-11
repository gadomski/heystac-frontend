import Card from "./base";
import { Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
];

export default function CatalogsCard({ catalogs }) {
  const catalogList = catalogs.map(catalog => {
    return (
      <li className="py-2" key={catalog.href}>
        <ChakraLink asChild>
          <NextLink href={"/catalogs/" + catalog["heystac:id"]}>
            {catalog.title}
          </NextLink>
        </ChakraLink>
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
