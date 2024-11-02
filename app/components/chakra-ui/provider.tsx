"use client";

import { createSystem, ChakraProvider, defaultConfig } from "@chakra-ui/react";
import { theme } from "./theme";

const system = createSystem(defaultConfig, theme);

export default function RootLayout(props: { children: React.ReactNode }) {
  return <ChakraProvider value={system}>{props.children}</ChakraProvider>;
}
