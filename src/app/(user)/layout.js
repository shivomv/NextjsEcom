import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNavBar from "@/components/layout/MobileNavBar";
import FloatingCartButton from "@/components/common/FloatingCartButton";
import BackToTopButton from "@/components/common/BackToTopButton";

export const metadata = {
  title: "Prashasak Samiti - Religious Products",
  description: "Shop for authentic religious and spiritual products - Puja items, Ganesh idols, and cow dung products",
};

export default function UserLayout({ children }) {
  return (
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
  );
}
