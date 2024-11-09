import { CollecticonStar } from "./collecticons";

export default function Stars({ stars }: { stars: number }) {
  const starsRounded = Math.round(10 * stars) / 10;
  const starIcons = Array(Math.round(stars)).fill(
    <CollecticonStar className="col-span-1"></CollecticonStar>
  );
  return (
    <div className="text-slate-400 block my-1">
      <div className="w-20 mx-auto flex justify-center">{starIcons}</div>
      <div className="flex justify-center">{starsRounded.toFixed(1)} / 5.0</div>
    </div>
  );
}
