import { useMemo } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  department_id: number | null;
  department_name?: string;
  department_slug?: string;
  role: string;
}

export const useAuth = () => {
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? (JSON.parse(userData) as User) : null;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const hasDepartment = !!user?.department_id;
  const departmentId = user?.department_id;
  const departmentSlug = user?.department_slug;

  const canAccessDepartment = (targetDepartmentId: number) => {
    if (isAdmin) return true; // Admins can access all departments
    return user?.department_id === targetDepartmentId;
  };

  const canAccessDepartmentBySlug = (targetDepartmentSlug: string) => {
    if (isAdmin) return true; // Admins can access all departments
    return user?.department_slug === targetDepartmentSlug;
  };

  const getDepartmentRedirect = () => {
    if (isAdmin) return "/departments"; // Admin sees all departments
    if (hasDepartment && departmentSlug)
      return `/departments/${departmentSlug}`;
    return "/dashboard"; // Fallback
  };

  return {
    user,
    isAdmin,
    isUser,
    hasDepartment,
    departmentId,
    departmentSlug,
    canAccessDepartment,
    canAccessDepartmentBySlug,
    getDepartmentRedirect,
  };
};

export default useAuth;
