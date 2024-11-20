import {
  Card,
  Container,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Importance, Rule } from "@stac-types";
import Root from "@stac/catalog.json";

function RuleSection({ id, rule }: { id: string; rule: Rule }) {
  return (
    <Card.Root>
      <Card.Header>{id}</Card.Header>
      <Card.Body>{rule.description}</Card.Body>
    </Card.Root>
  );
}

function Rules({
  name,
  rules,
  weight,
}: {
  name: string;
  rules: [string, Rule][];
  weight: number;
}) {
  return (
    <Stack gap={4}>
      <Heading size={"2xl"}>{name}</Heading>
      <Text color={"grey"}>Weight: {weight}</Text>
      <SimpleGrid rowGap={4} columnGap={4} minChildWidth={"sm"}>
        {rules.map(([id, rule]) => (
          <RuleSection key={id} id={id} rule={rule}></RuleSection>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default function Page() {
  let high: [string, Rule][] = [];
  let medium: [string, Rule][] = [];
  let low: [string, Rule][] = [];
  for (const [id, rule] of Object.entries(Root["heystac:rules"])) {
    if (rule.importance == Importance.High) {
      high.push([id, rule as Rule]);
    } else if (rule.importance == Importance.Medium) {
      medium.push([id, rule as Rule]);
    } else {
      low.push([id, rule as Rule]);
    }
  }
  const weights = Root["heystac:weights"];
  return (
    <Container my={"8"}>
      <Stack gap={"16"}>
        <Stack>
          <Heading size={"4xl"}>Rules</Heading>
          <Text>These rules are used to build our STAC ratings.</Text>
        </Stack>
        <Rules name="High" rules={high} weight={weights.high}></Rules>
        <Rules name="Medium" rules={medium} weight={weights.medium}></Rules>
        {/* <Rules name="Low" rules={low} weight={weights.low}></Rules> */}
      </Stack>
    </Container>
  );
}
