export interface Catalog {
  type: string;
  stac_version: string;
  id: string;
  description: string;
  links: Link[];
}

export interface Link {
  href: string;
  rel: string;
  type: string;
  title: string;
  "heystac:id": string;
}
