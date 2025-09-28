import { useState, useEffect, useRef } from "react";
import dp from "../assets/img/dp.jpg";
import logo from "../assets/img/Filamer.jpg"; // your logo
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
  onSidebarToggle?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ onSidebarToggle }) => {
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleLogout = () => {
    console.log("Logging out...");
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
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSettings(false);
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
            {/* Logo */}
            <img
              src={logo}
              alt="Filamer Logo"
              className="w-8 h-8 rounded-full object-cover"
            />

            {/* Sidebar toggle button */}
            <button
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              onClick={onSidebarToggle}
            >
              <span className="sr-only">Open sidebar</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
                ></path>
              </svg>
            </button>
          </div>

          {/* Right side: Profile dropdown */}
          <div className="flex items-center">
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
                  className="absolute right-0 mt-2 w-56 z-50 bg-white divide-y divide-gray-100 rounded-md shadow-lg dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul className="py-1">
                    <li>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Settings
                      </a>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white cursor-pointer"
                      >
                        Sign out
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
