export default function Card({ heading, subtitle, children }) {
  return (
    <div className="px-8 py-8 col-start-2">
      <h2>{heading}</h2>
      <p>{subtitle}</p>
      {children}
    </div>
  );
}
