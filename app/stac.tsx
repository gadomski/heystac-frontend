export interface Link {
  rel: string;
  href: string;
}

export interface Check {
  name: string;
  rating: number;
  total: number;
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

export interface Catalog extends StacObject {
  "heystac:stars": number;
  "heystac:checks": Check[];
}
export interface Collection extends StacObject {
  "heystac:stars": number;
  "heystac:checks": Check[];
}
export interface Container extends StacObject {}

export interface Properties {
  "heystac:stars": number;
  "heystac:checks": Check[];
}
export interface Item extends StacObject {
  properties: Properties;
}
