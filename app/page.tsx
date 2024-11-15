import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { use } from "react";
import Root from "../catalog/stac/catalog.json";
import Stars from "./components/stars";
import { Catalog } from "./stac";

function CatalogCard({ catalog }: { catalog: Catalog }) {
  return (
    <VStack>
      <Heading>
        <Link href={"/catalog/" + catalog.id}>{catalog.title}</Link>
      </Heading>
      <Stars stars={catalog["heystac:stars"]}></Stars>
      <Text>{catalog["heystac:stars"].toFixed(1)} / 5.0</Text>
    </VStack>
  );
}

export default function Page() {
  const catalogs = Root.links
    .filter(link => link.rel == "child")
    .map(link => use(import("../catalog/stac" + link.href.substring(1))))
    .sort((a, b) => b["heystac:stars"] - a["heystac:stars"])
    .map(catalog => (
      <CatalogCard catalog={catalog} key={catalog.id}></CatalogCard>
    ));
  return (
    <Box textAlign="center" pt="20vh">
      <VStack gap="8">
        <Heading size="4xl" letterSpacing="tight">
          heystac
        </Heading>

        <Heading size="lg" letterSpacing="tight">
          A curated geospatial asset discovery experience™
        </Heading>
      </VStack>

      <VStack pt="16" gap="8">
        {catalogs}
      </VStack>
    </Box>
  );
}
