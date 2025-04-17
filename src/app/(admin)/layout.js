import "../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import ClientOnly from "@/components/common/ClientOnly";
import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export const metadata = {
  title: "Admin Dashboard - Prashasak Samiti",
  description: "Admin dashboard for Prashasak Samiti e-commerce platform",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function AdminLayout({ children }) {
  return (
    <ClientOnly>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-gray-100 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
              <AdminHeader />
              <main className="flex-1 overflow-y-auto p-6 pb-20">
                {children}
              </main>
            </div>
          </div>
        </CartProvider>
      </AuthProvider>
    </ClientOnly>
  );
}
