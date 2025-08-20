import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import Departments from "../pages/department/departmentMainPage";
import ComputerStudies from "../pages/department/computerStudies/computerStudiesMainPage";
import ProgramOutcomes from "../pages/department/computerStudies/programOutcomes/programOutcomesMainPage";
import Curriculum from "../pages/department/computerStudies/curriculum/curriculumMainPage"; 
import Dashboard from "../pages/department/dashboardMainPage";
const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/departments" element={<Departments />} />
        <Route
          path="/departments/computer-studies"
          element={<ComputerStudies />}
        />
        <Route
          path="/departments/computer-studies/program-outcomes"
          element={<ProgramOutcomes />}
        />
        <Route
          path="/departments/computer-studies/curriculum"
          element={<Curriculum />}
        />{" "}
      </Route>
    </Routes>
  );
};

export default AppRoutes;
