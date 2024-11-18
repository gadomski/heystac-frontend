import {
  Link as ChakraLink,
  Heading,
  HStack,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import ApiStatus from "@components/api-status";
import { ButtonApi, ButtonStacBrowser } from "@components/buttons";
import Stars from "@components/stars";
import { Catalog, Collection, Link } from "@stac-types";
import Root from "@stac/catalog.json";
import { getCanonicalLink } from "app/actions";
import NextLink from "next/link";
import { ReactNode } from "react";

type Params = {
  id: string;
};

async function getCatalog(id: string): Promise<Catalog> {
  return await import("../../stac/" + id + "/catalog.json");
}

async function getCatalogFromLink(link: Link): Promise<Catalog> {
  return await import("../../stac" + link.href.substring(1));
}

async function getCollections(catalog: Catalog): Promise<Collection[]> {
  return await Promise.all(
    await catalog.links
      .filter(link => link.rel == "child")
      .map(async link => {
        return await import(
          "../../stac/" + catalog.id + link.href.substring(1)
        );
      })
  );
}

export async function generateStaticParams() {
  let params: Params[] = Array();
  for (let index = 0; index < Root.links.length; index++) {
    const link = Root.links[index];
    if (link.rel == "child") {
      const catalog: Catalog = await getCatalogFromLink(link);
      params.push({ id: catalog.id });
    }
  }
  return params;
}

function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <Stack my="4">
      <Heading size="sm" color="grey">
        {heading}
      </Heading>
      {children}
    </Stack>
  );
}

export default async function Page({ params }) {
  const { id } = await params;
  const catalog = await getCatalog(id);
  const canonicalLink = getCanonicalLink(catalog);
  const collections = (await getCollections(catalog)).sort(
    (a, b) => b["heystac:rating"].stars - a["heystac:rating"].stars
  );
  return (
    <SimpleGrid minChildWidth="md" m="8" gap="8">
      <Stack>
        <Section heading="Catalog">
          <Heading size="4xl">{catalog.title}</Heading>
          <Text>{catalog.description}</Text>
          <HStack>
            <Stars stars={catalog["heystac:rating"].stars}></Stars>
            {catalog["heystac:rating"].stars.toFixed(1)}
          </HStack>
        </Section>

        <Section heading="Status">
          {canonicalLink && (
            <HStack>
              <ApiStatus link={canonicalLink}></ApiStatus>
              <Text fontSize="sm" color="gray">
                {canonicalLink.href}
              </Text>
            </HStack>
          )}
        </Section>

        <Section heading="External links">
          {canonicalLink && (
            <HStack>
              <ButtonStacBrowser link={canonicalLink}></ButtonStacBrowser>
              <ButtonApi link={canonicalLink}></ButtonApi>
            </HStack>
          )}
        </Section>
      </Stack>

      <Stack>
        <Section heading="Collections">
          {collections.length} collections
          <Table.Root size="sm" stickyHeader>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Stars</Table.ColumnHeader>
                <Table.ColumnHeader>ID</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {collections.map(collection => (
                <Table.Row key={collection.id}>
                  <Table.Cell>
                    <HStack>
                      <Stars stars={collection["heystac:rating"].stars}></Stars>
                      {collection["heystac:rating"].stars.toFixed(1)}
                    </HStack>
                  </Table.Cell>
                  <Table.Cell>
                    <ChakraLink asChild>
                      <NextLink
                        href={catalog.id + "/collections/" + collection.id}
                      >
                        {collection.id}
                      </NextLink>
                    </ChakraLink>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Section>
      </Stack>
    </SimpleGrid>
  );
}
