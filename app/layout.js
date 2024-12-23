import "./globals.css";

export const metadata = {
  title: "Book Search App",
  description: "Search and display books using Open Library API",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
