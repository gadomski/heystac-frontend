"use client";

import CatalogsCard from "./components/card/catalog";
import Catalog from "./catalog.json";
import { Box, Heading, Text, Grid } from "@chakra-ui/react";

export default function Home() {
  // TODO: Use Catalog type
  let catalogs = Catalog["links"].filter(link => link["rel"] === "child");

  return (
    <Box h="full" textAlign="center">
      <Grid h="100%" templateColumns="1fr" placeContent="center">
        <Box my="8">
          <Heading py="2" size="xl">
            heystac
          </Heading>
          <Text>A curated geospatial asset discovery experience™</Text>
        </Box>
        <CatalogsCard catalogs={catalogs} />
      </Grid>
    </Box>
  );
}
