import { Heading, Text } from "@chakra-ui/react";

export default function Card({ heading, subtitle, children }) {
  return (
    <div>
      <div className="my-4">
        <Heading size="4xl" color="teal.600">
          {heading + "test"}
        </Heading>

        <Text>{subtitle}</Text>
      </div>

      <div>{children}</div>
    </div>
  );
}
