import { Rating } from "./rating";

export default function Stars({ stars }: { stars: number }) {
  return <Rating readOnly defaultValue={Math.round(stars)}></Rating>;
}
