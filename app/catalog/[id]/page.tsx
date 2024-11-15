import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemTrigger,
  AccordionRoot,
  Button,
  DataListItem,
  DataListItemLabel,
  DataListItemValue,
  DataListRoot,
  Heading,
  HStack,
  Link,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { use } from "react";
import Root from "../../../catalog/stac/catalog.json";
import {
  IconBad,
  IconExternalLink,
  IconOk,
  IconWarning,
} from "../../components/icons";
import Stars from "../../components/stars";
import { InfoTip } from "../../components/toggle-tip";
import { Catalog, Check, Collection, StacObject } from "../../stac";

type Params = {
  id: string;
};

export async function generateStaticParams() {
  let params: Params[] = Array();
  for (let index = 0; index < Root.links.length; index++) {
    const link = Root.links[index];
    if (link.rel == "child") {
      const catalog: Catalog = await import(
        "../../../catalog/stac" + link.href.substring(1)
      );
      params.push({ id: catalog.id });
    }
  }
  return params;
}

function Overview({ catalog }: { catalog: Catalog }) {
  const canonicalLink = catalog.links.find(link => link.rel == "canonical");
  let stacBrowserButton;
  let apiButton;
  if (canonicalLink && canonicalLink.href.startsWith("https://")) {
    const href =
      "https://radiantearth.github.io/stac-browser/#/external/" +
      canonicalLink.href.substring(8);
    stacBrowserButton = (
      <Link href={href} target="_blank">
        <Button colorPalette="teal">
          STAC Browser <IconExternalLink></IconExternalLink>
        </Button>
      </Link>
    );
    apiButton = (
      <Link href={canonicalLink.href} target="_blank">
        <Button variant="subtle" color="grey">
          API <IconExternalLink></IconExternalLink>
        </Button>
      </Link>
    );
  }
  return (
    <Stack gap="6">
      <Stack gap="1">
        <Heading size="4xl">{catalog.title}</Heading>
        <Heading size="lg">{catalog.description}</Heading>
      </Stack>
      <Stack gap="1">
        <Stars stars={catalog["heystac:stars"]}></Stars>
        <Text>{catalog["heystac:stars"].toFixed(1)} / 5.0</Text>
      </Stack>
      <HStack>
        {stacBrowserButton}
        {apiButton}
      </HStack>
    </Stack>
  );
}

function CheckDetail({
  stacObject,
  check,
}: {
  stacObject: StacObject;
  check: Check;
}) {
  let icon;
  if (check.rating == check.total) {
    icon = <IconOk></IconOk>;
  } else if (check.rating > 0) {
    icon = <IconWarning></IconWarning>;
  } else {
    icon = <IconBad></IconBad>;
  }
  let infoTip;
  if (check.message) {
    infoTip = <InfoTip content={check.message}></InfoTip>;
  }
  let type = stacObject.type;
  if (type == "Feature") {
    type = "Item";
  }
  return (
    <DataListItem key={stacObject.id + check.name}>
      <DataListItemLabel>{check.name}</DataListItemLabel>
      <DataListItemValue>
        <HStack>
          {icon}
          <Text>{type}</Text>
          {infoTip}
        </HStack>
      </DataListItemValue>
    </DataListItem>
  );
}

function CollectionCheck({
  catalog,
  collection,
}: {
  catalog: Catalog;
  collection: Collection;
}) {
  let icon = <IconOk></IconOk>;
  if (collection["heystac:stars"] <= 4) {
    icon = <IconWarning></IconWarning>;
  } else if (collection["heystac:stars"] <= 2) {
    icon = <IconBad></IconBad>;
  }
  let checks = collection["heystac:checks"].map(check => (
    <CheckDetail
      stacObject={collection}
      check={check}
      key={collection.id + "-" + check.name}
    ></CheckDetail>
  ));
  checks.push(
    ...collection.links
      .filter(link => link.rel == "item")
      .map(link =>
        use(
          import(
            "../../../catalog/stac/" +
              catalog.id +
              "/" +
              collection.id +
              link.href.substring(1)
          )
        )
      )
      .flatMap(item =>
        item.properties["heystac:checks"].map(check => (
          <CheckDetail
            stacObject={item}
            check={check}
            key={item.id + "-" + check.name}
          ></CheckDetail>
        ))
      )
  );
  return (
    <AccordionItem key={collection.id} value={collection.id}>
      <AccordionItemTrigger>
        {icon}
        <Text>{collection.id}</Text>
        <Text color="grey">{collection["heystac:stars"].toFixed(1)}</Text>
      </AccordionItemTrigger>
      <AccordionItemContent>
        <DataListRoot size="sm" orientation="horizontal" my="4">
          {checks}
        </DataListRoot>
      </AccordionItemContent>
    </AccordionItem>
  );
}

function Checks({ catalog }: { catalog: Catalog }) {
  const collections: Collection[] = catalog.links
    .filter(link => link.rel == "child")
    .map(link =>
      use(
        import("../../../catalog/stac/" + catalog.id + link.href.substring(1))
      )
    );
  collections.sort((a, b) => b["heystac:stars"] - a["heystac:stars"]);
  const collectionChecks = collections.map(collection => (
    <CollectionCheck
      catalog={catalog}
      collection={collection}
      key={collection.id}
    ></CollectionCheck>
  ));

  return (
    <Stack>
      <Heading size="xl">Collections</Heading>

      <AccordionRoot size="sm">{collectionChecks}</AccordionRoot>
    </Stack>
  );
}

export default async function Page({ params }) {
  const { id } = await params;
  const catalog: Catalog = await import(
    "../../../catalog/stac/" + id + "/catalog.json"
  );
  return (
    <SimpleGrid pt="8" gap="12" mx="8" columns={2}>
      <Overview catalog={catalog}></Overview>

      <Checks catalog={catalog}></Checks>
    </SimpleGrid>
  );
}
