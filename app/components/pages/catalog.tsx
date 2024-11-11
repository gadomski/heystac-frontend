import Link from "next/link";
import { Catalog, Collection } from "../../types/Stac";
import { Stars } from "../stars";
import { Heading, Lead, Prose, Subtitle } from "../typography";
import { Box, Grid, GridItem, Flex } from "@chakra-ui/react";

function CollectionCard({
  catalogId,
  collection,
}: {
  catalogId: string;
  collection: Collection;
}) {
  return (
    <Flex>
      <Link href={`/catalogs/${catalogId}/collections/${collection.id}`}>
        {collection.title}
      </Link>
      <Stars stars={collection["heystac:stars"] || 0} />
    </Flex>
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
    <Grid
      px="8"
      py="4"
      templateColumns={{ base: "1fr", md: "320px 1fr" }}
      templateRows={{ base: "auto auto 1fr", md: "auto 1fr" }}
      gap="4"
      h="full"
    >
      <GridItem rowSpan={1} colSpan={2}>
        <Heading>
          <Flex align="center">{title}</Flex>
        </Heading>
        <Subtitle>STAC version {catalog["stac_version"]}</Subtitle>
      </GridItem>

      <GridItem rowStart={2} colStart={1} p="4">
        <Lead>{catalog.description}</Lead>
        <Flex justify="center" my="4" color="gray.400">
          <Prose>
            <Stars stars={catalog["heystac:stars"] || 0} />
          </Prose>
        </Flex>
      </GridItem>

      <GridItem rowStart={{ base: 3, md: 2 }} colStart={{ base: 1, md: 2 }}>
        {collectionCards}
      </GridItem>
    </Grid>
  );
}
