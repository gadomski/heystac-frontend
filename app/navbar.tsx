"use client";

import {
  Box,
  ClientOnly,
  Flex,
  HStack,
  Link as LinkChakra,
  Skeleton,
} from "@chakra-ui/react";
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "@components/breadcrumb";
import LinkNext from "next/link";
import { usePathname } from "next/navigation";
import { ColorModeToggle } from "./components/color-mode-toggle";

function getBreadcrumbs() {
  const parts = usePathname().split("/");
  if (parts.length == 2 && !parts[0] && !parts[1]) {
    return <BreadcrumbCurrentLink>heystac</BreadcrumbCurrentLink>;
  } else if (parts.length == 3 && parts[1] == "catalogs") {
    return [
      <BreadcrumbLink key={0} asChild>
        <LinkNext href="/">heystac</LinkNext>
      </BreadcrumbLink>,
      <BreadcrumbCurrentLink key={1}>{parts[2]}</BreadcrumbCurrentLink>,
    ];
  } else {
    return (
      <BreadcrumbLink asChild>
        <LinkNext href="/">heystac</LinkNext>
      </BreadcrumbLink>
    );
  }
}

export default function Navbar() {
  const breadcrumbs = getBreadcrumbs();
  return (
    <Box>
      <Flex
        minH={"60px"}
        bg={{ base: "white", _dark: "gray.800" }}
        color={{ base: "gray.600", _dark: "white" }}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={{ base: "gray.200", _dark: "gray.900" }}
        align={"center"}
      >
        <Flex flex={1} justify={"start"}>
          <BreadcrumbRoot separator="/">{breadcrumbs}</BreadcrumbRoot>
        </Flex>
        <HStack>
          <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
            <ColorModeToggle />
          </ClientOnly>
          <LinkChakra asChild>
            <LinkNext href={"/rules"}>Rules</LinkNext>
          </LinkChakra>
        </HStack>
      </Flex>
    </Box>
  );
}
