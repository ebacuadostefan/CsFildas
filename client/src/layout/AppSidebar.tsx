import Filamer from "../assets/img/dp.jpg";
import { FaTachometerAlt, FaBuilding, FaClipboardList, FaTrash, FaUser, FaArchive } from "react-icons/fa";

interface AppSidebarProps {
  isOpen: boolean; // control sidebar visibility from parent
  onClose?: () => void; // optional callback for mobile overlay
}

const AppSidebar: React.FC<AppSidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen pt-10 pr-3 transition-transform bg-gray-400 border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          sm:translate-x-0`}
        aria-label="Sidebar"
      >
        {/* Logo + Close Button */}
        <div className="flex items-center justify-between mb-8 px-3 mt-8">
          <div className="flex items-center space-x-2">
            <img src={Filamer} alt="FCU" className="w-20 h-20 rounded-full" />
            <span className="text-white font-semibold text-lg">QA Admin</span>
          </div>
          {onClose && (
            <button
              className="sm:hidden text-white hover:text-gray-200 text-xl font-bold"
              onClick={onClose}
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation */}
        <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-400 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <a
                href="/dashboard"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaTachometerAlt className="text-white group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                <span className="ms-3">Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href="/departments"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaBuilding className="text-white group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                <span className="ms-3">Departments</span>
              </a>
            </li>
            <li>
              <a
                href="/activitypage"
                className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <FaClipboardList className="text-white group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                <span className="ms-3">Activity</span>
              </a>
            </li>
              <li>
                <a
                  href="*"
                  className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FaArchive className="text-white group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                  <span className="ms-3">Archive</span>
                </a>
              </li>
              <li>
                <a
                  href="/users"
                  className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
                >
                  <FaUser className="text-white group-hover:text-gray-700 dark:group-hover:text-gray-200" />
                  <span className="ms-3">User</span>
                </a>
              </li>
            

          </ul>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && onClose && (
        <div
          className="fixed inset-0 z-30 bg-black opacity-50 sm:hidden"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default AppSidebar;
