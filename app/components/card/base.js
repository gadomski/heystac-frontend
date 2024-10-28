import { Heading, Prose, Subtitle } from "@devseed-ui/typography";

export default function Card({ heading, subtitle, children }) {
  return (
    <div className="px-8 py-8 col-start-2">
      <Heading as="h2">{heading}</Heading>
      <Subtitle>{subtitle}</Subtitle>
      <Prose>{children}</Prose>
    </div>
  );
}
