import AdminSidebar from "@/components/admin/Sidebar";
import AdminHeader from "@/components/admin/Header";

export const metadata = {
  title: "Admin Dashboard - Prashasak Samiti",
  description: "Admin dashboard for Prashasak Samiti e-commerce platform",
};

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
