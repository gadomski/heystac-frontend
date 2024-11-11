import Link from "next/link";
import { use } from "react";
import { CollecticonExpandTopRight } from "@devseed-ui/collecticons-chakra";
import Map from "../map";
import {
  Box,
  Heading,
  Text,
  Grid,
  GridItem,
  Flex,
  Spacer,
} from "@chakra-ui/react";

export default function CatalogPage({ title, href }) {
  const data = use(fetch(href));
  const catalog = use(data.json());

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
          <Flex align="center">
            {title}
            <Spacer mx="2">
              <Link href={href} passHref>
                {/* <CollecticonExpandTopRight /> */}
              </Link>
            </Spacer>
          </Flex>
        </Heading>
        <Text>STAC version {catalog["stac_version"]}</Text>
      </GridItem>

      <GridItem
        rowStart={2}
        colStart={1}
        border="1px"
        borderColor="gray.200"
        p="4"
      >
        Placeholder for your content
      </GridItem>

      <GridItem rowStart={{ base: 3, md: 2 }} colStart={{ base: 1, md: 2 }}>
        <Map center={[-105, 39.7373]} zoom={2} />
      </GridItem>
    </Grid>
  );
}
