import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import { LinkCatalog } from "@components/links";
import Stars from "@components/stars";
import { Catalog } from "@stac-types";
import Root from "@stac/catalog.json";

function CatalogCard({ catalog }: { catalog: Catalog }) {
  const rating = catalog["heystac:rating"];
  return (
    <VStack>
      <Heading>
        <LinkCatalog catalog={catalog}>{catalog.title}</LinkCatalog>
      </Heading>
      <Stars stars={rating.stars}></Stars>
      <Text>{rating.stars.toFixed(1)} / 5.0</Text>
    </VStack>
  );
}

async function getCatalogs(): Promise<Catalog[]> {
  return await Promise.all(
    Root.links
      .filter(link => link.rel == "child")
      .map(async link => {
        return await import("./stac" + link.href.substring(1));
      })
  );
}

export default async function Page() {
  const catalogs = (await getCatalogs())
    .sort((a, b) => b["heystac:rating"].stars - a["heystac:rating"].stars)
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
