import { HStack } from "@chakra-ui/react";
import { CollecticonStar } from "@devseed-ui/collecticons-react";

export default function Stars({ stars }: { stars: number }) {
  const icons = Array(Math.round(stars)).fill(
    <CollecticonStar></CollecticonStar>
  );
  return <HStack>{icons}</HStack>;
}
