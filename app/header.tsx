import { Box, ClientOnly, Skeleton } from "@chakra-ui/react";
import { ColorModeToggle } from "./components/color-mode-toggle";

export default function Header() {
  return (
    <div>
      <Box pos="absolute" top="4" right="4">
        <ClientOnly fallback={<Skeleton w="10" h="10" rounded="md" />}>
          <ColorModeToggle />
        </ClientOnly>
      </Box>
    </div>
  );
}
