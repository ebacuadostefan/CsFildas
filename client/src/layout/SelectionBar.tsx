import {
  FaPlus,
  FaCheckSquare,
  FaRegSquare,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

type SelectionBarProps = {
  onAdd?: (() => void) | undefined;
  totalItems?: number;
  selectedItems?: number;
  onSelectAll?: (selectAll: boolean) => void;
  onEdit?: () => void;
  isEditing?: boolean; // track edit mode
  onDelete?: () => void;
  onRename?: () => void;
  addLabel?: string;
  deleteLabel?: string;
  renameLabel?: string;
};

const SelectionBar: React.FC<SelectionBarProps> = ({
  onAdd,
  totalItems = 0,
  selectedItems = 0,
  onSelectAll,
  onEdit,
  isEditing = false,
  onDelete,
  onRename,
  addLabel = "New",
  deleteLabel = "Delete",
  renameLabel = "Rename",
}) => {
  const allSelected = totalItems > 0 && selectedItems === totalItems;

  return (
    <div className="bg-white shadow-lg px-4 py-2 w-full flex items-center text-gray-500">
      {/* Left side: Add New */}
      <div className="mr-auto">
        {onAdd && (
          <button
            onClick={onAdd}
            className="flex items-center gap-1 hover:text-blue-500 transition"
          >
            <FaPlus />
            <span className="hidden sm:inline">{addLabel}</span>
          </button>
        )}
      </div>

      {/* Right side: action buttons */}
      <div className="flex items-center gap-4">
        {/* Edit / Done toggle */}
        {onEdit && (
          <button
            onClick={onEdit}
            className="flex items-center gap-1 hover:text-blue-500 transition"
          >
            <FaEdit />
            <span className="hidden sm:inline">
              {isEditing ? "Done" : "Edit"}
            </span>
          </button>
        )}

        {/* Select All / Unselect All: only show in edit mode */}
        {isEditing && onSelectAll && (
          <button
            onClick={() => onSelectAll(!allSelected)}
            disabled={totalItems === 0}
            className={`flex items-center gap-1 transition ${
              totalItems === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:text-blue-500"
            }`}
          >
            {allSelected ? <FaCheckSquare /> : <FaRegSquare />}
            <span className="hidden sm:inline">
              {allSelected ? "Unselect All" : "Select All"}
            </span>
          </button>
        )}

        {/* Delete button */}
        <button
          onClick={onDelete}
          disabled={!onDelete || selectedItems === 0}
          className={`flex items-center gap-1 transition ${
            !onDelete || selectedItems === 0
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-red-500"
          }`}
        >
          <FaTrash />
          <span className="hidden sm:inline">{deleteLabel}</span>
        </button>

        {/* Rename button */}
        <button
          onClick={onRename}
          disabled={!onRename || selectedItems !== 1}
          className={`flex items-center gap-1 transition ${
            !onRename || selectedItems !== 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:text-blue-500"
          }`}
        >
          <FaEdit />
          <span className="hidden sm:inline">{renameLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default SelectionBar;
