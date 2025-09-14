import { Outlet } from "react-router-dom";
import AppSidebar from "./AppSidebar";
import AppHeader from "./AppHeader";

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <AppSidebar />
      <AppHeader />
      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 sm:ml-52">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
