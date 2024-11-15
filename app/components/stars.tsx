import { HStack, Icon } from "@chakra-ui/react";
import { CollecticonStar } from "@devseed-ui/collecticons-react";

const Star = () => (
  <Icon>
    <CollecticonStar></CollecticonStar>
  </Icon>
);

export default function Stars({ stars }: { stars: number }) {
  const icons = Array(Math.round(stars))
    .fill(0)
    .map((_, index) => <Star key={index}></Star>);
  return <HStack>{icons}</HStack>;
}
