import Breadcrumbs from "../components/BreadCrumps.tsx/Breadcrumps";

type HeadbarProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onAdd: () => void;
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

      {/* Search + Add */}
      <div className="flex items-center shadow-lg gap-2 w-full sm:w-auto">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 sm:flex-none w-full max-w-md px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>
    </div>
  );
};

export default Headbar;
