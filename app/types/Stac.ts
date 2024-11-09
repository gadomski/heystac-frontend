export interface Catalog {
  type: string;
  stac_version: string;
  id: string;
  title: string;
  description: string;
  created: string;
  updated: string;
  license: string;
  providers: Provider[];
  links: Link[];
  "heystac:stars"?: number;
}

export interface Link {
  href: string;
  rel: string;
  type: string;
  title: string;
  "heystac:id"?: string;
}

export interface Provider {
  name: string;
  roles: string[];
  url: string;
}
