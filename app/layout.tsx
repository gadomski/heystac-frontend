import "./open-sans.css";
import ChakraProvider from "@/components/chakra/provider";
import Navbar from "@/components/navbar";
import { Box, Flex } from "@chakra-ui/react";

export const metadata = {
  title: "heystac",
  description: "A curated geospatial asset discovery experience™",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ChakraProvider>
          <Flex direction="column" w="100vw" h="100vh">
            <Navbar />
            <Box flex="1">{children}</Box>
          </Flex>
        </ChakraProvider>
      </body>
    </html>
  );
}
