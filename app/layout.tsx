import "./open-sans.css";
import "./globals.css";
import DevseedUiThemeProvider from "./components/theme-provider";
import Navbar from "./components/navbar";

export const metadata = {
  title: "heystac",
  description: "A curated geospatial asset discovery experience™",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <DevseedUiThemeProvider>
          <Navbar></Navbar>
          {children}
        </DevseedUiThemeProvider>
      </body>
    </html>
  );
}
