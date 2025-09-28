import { FaChevronRight, FaHome } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import BackButton from "../../../../components/Button/BackButton";

interface BreadcrumbsProps {
  folderName?: string;
}

const Breadcrumbs = ({ folderName }: BreadcrumbsProps) => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="flex flex-wrap items-center text-sm text-gray-600 mb-6 space-x-2 sm:space-x-4">
      <BackButton />
      <div className="flex flex-wrap items-center space-x-2">
        <FaHome
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />
        <FaChevronRight className="text-gray-400 hidden sm:inline" />
        <span
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => navigate("/departments")}
        >
          Departments
        </span>
        <FaChevronRight className="text-gray-400 hidden sm:inline" />
        <span className="text-blue-600 font-semibold">
          {folderName || slug || "Loading..."}
        </span>
      </div>
    </div>
  );
};

export default Breadcrumbs;
