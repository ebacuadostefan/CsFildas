import { useState, useEffect, useRef } from "react";
import dp from "../assets/img/dp.jpg";
import logo from "../assets/img/Filamer.jpg";
import { useNavigate } from "react-router-dom";
import { FaCog, FaSignOutAlt, FaBars, FaBell } from "react-icons/fa";
import NotificationDropdown from "./NotificationDropdown";

interface AppHeaderProps {
  onSidebarToggle?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onSidebarToggle }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const notifButtonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowSettings(false);
      }

      if (
        notifButtonRef.current &&
        !notifButtonRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowSettings(false);
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  return (
    <nav className="fixed top-0 z-50 w-full bg-gray-400 border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-1 py-1 lg:px-2">
        <div className="flex items-center justify-between w-full">
          {/* Left side: Logo + Sidebar toggle */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <img
                src={logo}
                alt="Filamer Logo"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-white">FiLDas</span>
            </div>
            <button
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
              onClick={onSidebarToggle}
            >
              <FaBars className="w-5 h-5" />
            </button>
          </div>

          {/* Right side: Profile + Notifications */}
          <div className="flex items-center space-x-3">
            <div className="relative mr-3 mt-1">
              <button
                ref={notifButtonRef}
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                <FaBell className="w-5 h-5" />
              </button>
              <NotificationDropdown
                isOpen={showNotifications}
                onClose={() => setShowNotifications(false)}
              />
            </div>

            <div className="relative">
              <button
                ref={buttonRef}
                type="button"
                onClick={() => setShowSettings(!showSettings)}
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-6 h-6 rounded-full m-1"
                  src={dp}
                  alt="user photo"
                />
              </button>

              {showSettings && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-1.5 mr-3 w-56 z-50 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul className="py-2">
                    <li>
                      <a
                        href="#"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                      >
                        <FaCog /> Settings
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        <FaSignOutAlt /> Sign out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppHeader;
