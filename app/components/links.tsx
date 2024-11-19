import { Link as LinkChakra } from "@chakra-ui/react";
import { Catalog, Collection } from "@stac-types";
import LinkNext from "next/link";
import { ReactNode } from "react";

export function LinkCatalog({
  catalog,
  children,
}: {
  catalog: Catalog;
  children: ReactNode;
}) {
  return (
    <LinkChakra asChild>
      <LinkNext href={"/catalogs/" + catalog.id}>{children}</LinkNext>
    </LinkChakra>
  );
}

export function LinkCollection({
  catalog,
  collection,
  children,
}: {
  catalog: Catalog;
  collection: Collection;
  children: ReactNode;
}) {
  return (
    <LinkChakra asChild>
      <LinkNext
        href={"/catalogs/" + catalog.id + "/collections/" + collection.id}
      >
        {children}
      </LinkNext>
    </LinkChakra>
  );
}
