import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const UserDashboardPage = () => {
  const navigate = useNavigate();
  const sessionUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const departmentId: number | null = sessionUser?.department_id ?? null;
  const departmentName = sessionUser?.department_name ?? "My Department";
  const departmentSlug = sessionUser?.department_slug ?? undefined;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-blue-700">Welcome</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg"
          onClick={() => navigate("/dashboard")}
        >
          <h2 className="font-semibold text-gray-700">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Overall stats</p>
        </div>

        {departmentId && (
          <div
            className="bg-white rounded-xl shadow-md p-6 cursor-pointer hover:shadow-lg"
            onClick={() => {
              if (departmentSlug) navigate(`/departments/${departmentSlug}`);
              else navigate("/departments");
            }}
          >
            <h2 className="font-semibold text-gray-700">{departmentName}</h2>
            <p className="text-gray-500 text-sm mt-1">
              Manage files and folders
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboardPage;
