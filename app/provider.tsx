"use client";

import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import { createContext } from "react";

export const BreadcrumbContext = createContext([]);

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <BreadcrumbContext.Provider value={[]}>
          {props.children}
        </BreadcrumbContext.Provider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
