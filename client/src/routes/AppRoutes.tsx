import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import LoginPage from "../pages/auth/LoginPage";

import Departments from "../pages/department/departmentMainPage";
import Dashboard from "../pages/dashboardMainPage";
import DepartmentFolderPage from "../pages/department/Folders/DepartmentFolderPage";
import FolderPage from "../pages/department/Folders/FolderPage";
import ActivityPage from "../pages/activityMainPage";
import UserPage from "../pages/user/UserPage";
import ArchivePage from "../pages/archiveMainPage";
import NotificationPage from "../pages/notificationMainPage";

// Optional: create a simple NotFound page
const NotFoundPage = () => (
  <h1 className="text-center mt-10 text-2xl">404 | Page Not Found</h1>
);

const AppRoutes = () => {
  // Simplified routing: no role-based guard; dashboard is directly accessible after login

  return (
    <Routes>
      {/*Public route */}
      <Route path="/" element={<LoginPage />} />

      {/*Protected routes (inside AppLayout) */}
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />

        <Route path="activitypage" element={<ActivityPage />} />

        <Route path="archives" element={<ArchivePage />} />

        <Route path="/users" element={<UserPage />} />

        <Route path="notify" element={<NotificationPage />} />

        {/* Departments list */}
        <Route path="departments" element={<Departments />} />

        {/* Department folder management */}
        <Route path="departments/:slug" element={<DepartmentFolderPage />} />

        {/* Department folder files */}
        <Route
          path="departments/:slug/folders/:folderSlug"
          element={<FolderPage />}
        />
      </Route>

      {/*Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
