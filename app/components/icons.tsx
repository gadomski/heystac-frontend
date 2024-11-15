import { Icon } from "@chakra-ui/react";
import {
  CollecticonCircleExclamation,
  CollecticonCircleTick,
  CollecticonCircleXmark,
  CollecticonExpandTopRight,
} from "@devseed-ui/collecticons-react";

export const IconOk = () => (
  <Icon color="green">
    <CollecticonCircleTick></CollecticonCircleTick>
  </Icon>
);

export const IconWarning = () => (
  <Icon color="orange">
    <CollecticonCircleExclamation></CollecticonCircleExclamation>
  </Icon>
);

export const IconBad = () => (
  <Icon color="red">
    <CollecticonCircleXmark></CollecticonCircleXmark>
  </Icon>
);

export const IconExternalLink = () => (
  <Icon>
    <CollecticonExpandTopRight></CollecticonExpandTopRight>
  </Icon>
);
