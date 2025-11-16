import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { CategoryProvider } from "@/context/CategoryContext";
import ClientOnly from "@/components/common/ClientOnly";

export const metadata = {
  title: "Prashasak Samiti - Religious Products",
  description: "Shop for authentic religious and spiritual products - Puja items, Ganesh idols, and cow dung products",
  icons: {
    icon: '/icon.png',
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
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
        <ClientOnly>
          <AuthProvider>
            <CartProvider>
              <CategoryProvider>
                {children}
              </CategoryProvider>
            </CartProvider>
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
