import { Box, Link as ChakraLink } from "@chakra-ui/react";
import NextLink from "next/link";

export default function Navbar() {
  return (
    <Box
      mx="auto"
      w="100vw"
      h="12"
      display="flex"
      alignItems="center"
      px="8"
      boxShadow="md"
    >
      <ChakraLink as={NextLink} href="/" fontWeight="bold" color="primary">
        heystac
      </ChakraLink>
    </Box>
  );
}
