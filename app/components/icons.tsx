import { Icon } from "@chakra-ui/react";
import {
  CollecticonSignDanger,
  CollecticonTick,
  CollecticonXmark,
} from "@devseed-ui/collecticons-react";

export const IconOk = () => (
  <Icon color="green">
    <CollecticonTick></CollecticonTick>
  </Icon>
);

export const IconWarning = () => (
  <Icon color="orange">
    <CollecticonSignDanger></CollecticonSignDanger>
  </Icon>
);

export const IconBad = () => (
  <Icon color="red">
    <CollecticonXmark></CollecticonXmark>
  </Icon>
);
