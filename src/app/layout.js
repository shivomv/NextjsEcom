import "./globals.css";

export const metadata = {
  title: "Prashasak Samiti - Religious Products",
  description: "Shop for authentic religious and spiritual products - Puja items, Ganesh idols, and cow dung products",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-pattern-dots font-sans`}
        suppressHydrationWarning={true} // Suppress hydration warnings for body attributes
      >

                <main className="flex-grow">
                  {children}
                </main>

      </body>
    </html>
  );
}
