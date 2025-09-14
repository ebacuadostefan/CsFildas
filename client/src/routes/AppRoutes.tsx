import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import LoginPage from "../pages/auth/LoginPage";

import Departments from "../pages/department/departmentMainPage";
import ComputerStudies from "../pages/department/computerStudies/computerStudiesMainPage";
import Dashboard from "../pages/dashboardMainPage";
import FolderPage from "../pages/department/computerStudies/Folders/FolderPage";
// Optional: create a simple NotFound page
const NotFoundPage = () => (
  <h1 className="text-center mt-10 text-2xl">404 | Page Not Found</h1>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* ✅ Public route */}
      <Route path="/" element={<LoginPage />} />

      {/* ✅ Protected routes (inside AppLayout) */}
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="departments" element={<Departments />} />
        <Route
          path="departments/computerstudies"
          element={<ComputerStudies />}
        />
        <Route
          path="departments/computerstudies/folder/:id"
          element={<FolderPage />}
        />
      </Route>

      {/* ✅ Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
