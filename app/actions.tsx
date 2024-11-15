import { use } from "react";
import { Catalog } from "./stac";

function getCatalog(from: string, href: string): Catalog {
  let path = from;
  if (!path.endsWith("/")) {
    path = path.split("/").slice(0, -1).join("/");
  }
  if (href.startsWith("./")) {
    path += href.substring(1);
  } else if (href.startsWith("/")) {
    path += href;
  } else {
    path += "/" + href;
  }
  // TODO handle parents, i.e. ".."
  return use(import("../catalog/stac" + path));
}

export { getCatalog };
