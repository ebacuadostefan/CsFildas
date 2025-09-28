import { FaChevronRight, FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../Button/BackButton";

const Breadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Split the current URL into parts
  const pathParts = location.pathname.split("/").filter(Boolean);

  return (
    <div className="flex items-center text-sm text-gray-600 space-x-2">
      {/* Back Button */}
      <BackButton />

      <div className="flex items-center space-x-2">
        {/* Home Icon */}
        <FaHome
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />

        {/* Dynamic Path */}
        {pathParts.map((part, index) => {
          const pathTo = "/" + pathParts.slice(0, index + 1).join("/");
          const isLast = index === pathParts.length - 1;

          return (
            <div key={index} className="flex items-center space-x-2">
              <FaChevronRight className="text-gray-400" />
              <span
                onClick={() => !isLast && navigate(pathTo)}
                className={`${
                  isLast
                    ? "text-blue-600 font-medium cursor-default"
                    : "text-gray-600 hover:text-blue-500 cursor-pointer"
                } capitalize`}
              >
                {part.replace(/-/g, " ")}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumbs;
