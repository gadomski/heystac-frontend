import { Button, Link as ChakraLink } from "@chakra-ui/react";
import { Link } from "@stac-types";
import { IconExternalLink } from "./icons";

export function ButtonStacBrowser({ link }: { link: Link }) {
  const stacBrowserHref =
    "https://radiantearth.github.io/stac-browser/#/external/" +
    link.href.substring(8);
  return (
    <ChakraLink href={stacBrowserHref} target="_blank">
      <Button colorPalette="teal">
        STAC browser <IconExternalLink></IconExternalLink>
      </Button>
    </ChakraLink>
  );
}

export function ButtonApi({ link }: { link: Link }) {
  return (
    <ChakraLink href={link.href} target="_blank">
      <Button variant="subtle" color="gray">
        API <IconExternalLink></IconExternalLink>
      </Button>
    </ChakraLink>
  );
}
