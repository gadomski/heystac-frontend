import "./globals.css";

export const metadata = {
  title: "heystac",
  description: "A curated geospatial asset discovery experience™",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
