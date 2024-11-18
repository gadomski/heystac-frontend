import { Link, StacObject } from "@stac-types";

export function getCanonicalLink(stac_object: StacObject): Link | undefined {
  return stac_object.links.find(link => link.rel == "canonical");
}

type Check = {
  isSuccess: boolean;
  label: string;
};

export async function getLinkHref(link: Link): Promise<Check> {
  try {
    const response = await fetch(link.href);
    if (!response.ok) {
      return {
        isSuccess: false,
        label: response.status + " " + response.statusText,
      };
    } else {
      return {
        isSuccess: true,
        label: "API is up!",
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      label: error,
    };
  }
}
