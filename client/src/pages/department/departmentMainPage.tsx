import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaChevronRight } from "react-icons/fa";
import BackButton from "../../components/Button/BackButton";
import CCSimg from "../../assets/img/CSSimg.jpg";

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const departments = [
    "Computer Studies",
    "Hospitality and Tourism Management",
    "College of Nursing",
    "Arts and Science",
    "Business and Accountancy",
    "Teacher's Education",
  ];

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-15 max-w-7xl mx-auto relative">
      {/* Breadcrumbs + Back Button */}
      <div className="flex items-center text-sm text-gray-600 mb-6 space-x-4">
        <BackButton />
        <div className="flex items-center space-x-2">
          <FaHome className="text-blue-500" />
          <FaChevronRight className="text-gray-400" />
          <span className="text-blue-600 font-medium">Departments</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8 flex justify-center sm:justify-start">
        <input
          type="text"
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* Department Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 cursor-pointer">
        {filteredDepartments.length > 0 ? (
          filteredDepartments.map((dept, index) => (
            <div
              key={index}
              onClick={() =>
                dept === "Computer Studies"
                  ? navigate("/departments/computerstudies")
                  : alert(`Page for ${dept} is not yet available.`)
              }
              className="bg-white rounded-lg shadow-md flex flex-col items-center p-6 hover:shadow-lg transition"
            >
              {/* ✅ Show image for Computer Studies, otherwise placeholder */}
              {dept === "Computer Studies" ? (
                <img
                  src={CCSimg}
                  alt="Computer Studies"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full mb-4 object-cover"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-full mb-4"></div>
              )}

              <p className="text-center font-medium text-gray-700 uppercase text-sm">
                {dept}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-600 col-span-full text-center">
            No departments found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Departments;
