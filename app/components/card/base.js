export default function Card({ heading, subtitle, children }) {
  return (
    <div className="col-start-2 my-8">
      <h2 className="text-2xl">{heading}</h2>
      <p className="text-lg font-light">{subtitle}</p>
      <div className="py-4">{children}</div>
    </div>
  );
}
