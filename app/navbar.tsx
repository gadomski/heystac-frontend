"use client";

import { Box, ClientOnly, Flex, Skeleton, Text } from "@chakra-ui/react";
import { ColorModeToggle } from "./components/color-mode-toggle";

export default function Navbar() {
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
        <Flex flex={{ base: 1 }} justify={{ base: "center", md: "start" }}>
          <Text>heystac</Text>
        </Flex>
        <Flex>
          <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
            <ColorModeToggle />
          </ClientOnly>
        </Flex>
      </Flex>
    </Box>
  );
}
