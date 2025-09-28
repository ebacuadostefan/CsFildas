import { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  // State to control sidebar visibility on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      {/* Header */}
      <AppHeader onSidebarToggle={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 sm:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
