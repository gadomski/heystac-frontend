import { Box, Heading, Text } from "@chakra-ui/react";

export default function Card({ heading, subtitle, children }) {
  return (
    <Box>
      <Box my="4">
        <Heading size="3xl">{heading}</Heading>
        <Text>{subtitle}</Text>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}
