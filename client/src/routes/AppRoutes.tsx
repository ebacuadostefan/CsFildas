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

// Optional: create a simple NotFound page
const NotFoundPage = () => (
  <h1 className="text-center mt-10 text-2xl">404 | Page Not Found</h1>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/*Public route */}
      <Route path="/" element={<LoginPage />} />

      {/*Protected routes (inside AppLayout) */}
      <Route element={<AppLayout />}>
        <Route path="dashboard" element={<Dashboard />} />

        {/* Departments list */}
        <Route path="departments" element={<Departments />} />

        {/* Department folder management */}
        <Route path="departments/:slug" element={<DepartmentFolderPage />} />

        {/* Department folder files */}
        <Route
          path="departments/:slug/folders/:folderSlug"
          element={<FolderPage />}
        />
        <Route element={<ActivityPage />} path="activitypage" />

        <Route element={<ArchivePage />} path="archives" />

        <Route path="/users" element={<UserPage />} />
      </Route>

      {/*Catch-all route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
