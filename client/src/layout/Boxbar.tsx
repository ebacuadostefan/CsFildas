import Breadcrumbs from "../components/BreadCrumps.tsx/Breadcrumps";

type HeadbarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAdd?: () => void;
};

const Headbar: React.FC<HeadbarProps> = ({
  searchTerm,
  setSearchTerm,
  onAdd,
}) => {
  return (
    <div className="bg-white shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between relative w-full">
      {/* Breadcrumbs */}
      <h1 className="text-lg font-semibold text-gray-700 mb-3 sm:mb-0">
        <Breadcrumbs />
      </h1>

      {/* Search bar */}
      <div className="flex items-center shadow-lg gap-2 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 sm:flex-none w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          className="mt-3 sm:mt-0 sm:ml-4 px-3 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          New
        </button>
      )}
    </div>
  );
};

export default Headbar;
