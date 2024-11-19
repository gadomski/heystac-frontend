export interface Link {
  rel: string;
  href: string;
}

export interface Check {
  rule_id: string;
  score: number;
  message?: string;
}

export interface Asset {
  href: string;
}

export interface Assets {
  thumbnail?: Asset;
}

export interface StacObject {
  type: string;
  id: string;
  title: string;
  description: string;
  links: Link[];
  assets: Assets;
}

export interface Issues {
  high: Check[];
  medium: Check[];
  low: Check[];
}

export type OwnedCheck = {
  rule_id: string;
  score: number;
  message?: string;
  catalog: Catalog;
  collection?: Collection;
  item?: Item;
};

export type OwnedIssues = {
  high: OwnedCheck[];
  medium: OwnedCheck[];
  low: OwnedCheck[];
};

export interface Rating {
  stars: number;
  issues: Issues;
}

export interface Catalog extends StacObject {
  "heystac:rating": Rating;
}
export interface Collection extends StacObject {
  "heystac:rating": Rating;
}
export interface Container extends StacObject {}

export interface Properties {
  "heystac:rating": Rating;
}
export interface Item extends StacObject {
  properties: Properties;
}
