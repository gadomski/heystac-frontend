import { Heading, Prose, Subtitle } from "@devseed-ui/typography";

export default function Card({ heading, subtitle, children }) {
  return (
    <div>
      <div className="my-4">
        <Heading>{heading}</Heading>

        <Subtitle>{subtitle}</Subtitle>
      </div>

      <Prose>{children}</Prose>
    </div>
  );
}
