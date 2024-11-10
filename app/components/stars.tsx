import { CollecticonStar } from "./collecticons";

export function Stars({ stars }: { stars: number }) {
  const starIcons = Array(Math.round(stars)).fill(
    <CollecticonStar></CollecticonStar>
  );
  return <span className="flex">{starIcons}</span>;
}

export function Rating({ stars }: { stars: number }) {
  return <span>{(Math.round(10 * stars) / 10).toFixed(1)} / 5.0</span>;
}
