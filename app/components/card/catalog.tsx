import Card from "./base";
import { Link as ChakraLink, List, ListItem } from "@chakra-ui/react";
import NextLink from "next/link";

const items = [
  { value: "a", title: "First Item", text: "Some value 1..." },
  { value: "b", title: "Second Item", text: "Some value 2..." },
  { value: "c", title: "Third Item", text: "Some value 3..." },
];

export default function CatalogsCard({ catalogs }) {
  const catalogList = catalogs.map(catalog => {
    return (
      <ListItem py="2" key={catalog.href}>
        <ChakraLink as={NextLink} href={"/catalogs/" + catalog["heystac:id"]}>
          {catalog.title}
        </ChakraLink>
      </ListItem>
    );
  });

  return (
    <Card
      heading={"Catalogs"}
      subtitle={"A hand-picked list of quality STAC APIs"}
    >
      <List.Root>{catalogList}</List.Root>
    </Card>
  );
}
