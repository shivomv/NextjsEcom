import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import MobileNavBar from "../components/layout/MobileNavBar";
import FloatingCartButton from "../components/common/FloatingCartButton";
import BackToTopButton from "../components/common/BackToTopButton";
import { AuthProvider } from "../context/AuthContext";
import { CartProvider } from "../context/CartContext";

export const metadata = {
  title: "Prashasak Samiti - Religious Products",
  description: "Shop for authentic religious and spiritual products - Puja items, Ganesh idols, and cow dung products",
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`antialiased bg-pattern-dots font-sans`}
      >
        <AuthProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
              <MobileNavBar />
              <FloatingCartButton />
              <BackToTopButton />
            </div>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
