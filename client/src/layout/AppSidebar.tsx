import Filamer from "../assets/img/Filamer.jpg";

const AppSidebar = () => {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-65 h-screen pt-10 pr-3 transition-transform -translate-x-full bg-gray-400 border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      {/* Logo at top */}
      <div className="flex flex-col items-center justify-center mb-3 pt-3 ">
        <img src={Filamer} alt="FCU" className="w-20 h-20 rounded-full mb-2" />
        <span className="text-white font-semibold text-lg mb-5">ADMIN</span>
      </div>

      {/* Navigation Links */}
      <div className="h-full px-3 pb-4 overflow-y-auto bg-gray-400 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          <li>
            <a
              href="/dashboard"
              className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Dashboard</span>
            </a>
          </li>
          <li>
            <a
              href="/departments"
              className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Departments</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Activity</span>
            </a>
          </li>
          <li>
            <a
              href="#"
              className="flex items-center p-2 text-white rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
            >
              <span className="ms-3">Message</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
};

export default AppSidebar;
