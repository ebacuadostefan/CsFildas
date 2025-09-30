import React, { useEffect, useRef, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { type ArchivedItem } from "../../services/ArchiveServices";

type ArchiveTableProps = {
  items: ArchivedItem[];
  isEditing?: boolean;
  selected?: string[];
  onToggleSelect?: (key: string) => void;
  onToggleSelectAll?: () => void;
  onRestore: (item: ArchivedItem) => void;
  onDelete: (item: ArchivedItem) => void;
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const ArchiveTable: React.FC<ArchiveTableProps> = ({
  items,
  isEditing = false,
  selected = [],
  onToggleSelect,
  onToggleSelectAll,
  onRestore,
  onDelete,
}) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="overflow-x-auto rounded-xl shadow-lg mt-4">
      <table className="min-w-full bg-white ">
        <thead>
          <tr className="text-gray-600 uppercase text-xs leading-normal bg-white shadow-lg">
            {isEditing && (
              <th className="py-3 px-3 text-center w-12 rounded-tl-xl">
                <input
                  type="checkbox"
                  checked={
                    selected.length > 0 && selected.length === items.length
                  }
                  onChange={onToggleSelectAll}
                  className="form-checkbox h-4 w-4 text-blue-600 rounded cursor-pointer"
                />
              </th>
            )}
            <th
              className={`py-3 px-6 text-left font-semibold ${
                !isEditing ? "rounded-tl-xl" : ""
              }`}
            >
              Name
            </th>
            <th className="py-3 px-6 text-left font-semibold">Department</th>
            <th className="py-3 px-6 text-left font-semibold">Type</th>
            <th className="py-3 px-6 text-left font-semibold">Date Archived</th>
            <th className="py-3 px-6 text-center font-semibold rounded-tr-xl">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-gray-700 text-sm font-light">
          {items.length > 0 ? (
            items.map((item) => {
              const rowKey = `${item.type}-${item.id}`;
              return (
                <tr
                  key={rowKey}
                  className={`border-b border-gray-100 transition duration-100 hover:bg-gray-50`}
                >
                  {isEditing && (
                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={selected.includes(rowKey)}
                        onChange={() =>
                          onToggleSelect && onToggleSelect(rowKey)
                        }
                        className="form-checkbox h-4 w-4 text-blue-600 rounded cursor-pointer"
                      />
                    </td>
                  )}
                  <td className="py-3 px-6 font-medium text-gray-800">
                    {item.name}
                  </td>
                  <td className="py-3 px-6">{item.department_name}</td>
                  <td className="py-3 px-6 capitalize">{item.type}</td>
                  <td className="py-3 px-6">{formatDate(item.archived_at)}</td>
                  <td className="py-3 px-6 text-center">
                    <div
                      className="relative inline-block text-left"
                      ref={menuRef}
                    >
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === rowKey ? null : rowKey)
                        }
                        className="p-2 rounded-full hover:bg-gray-100 transition focus:outline-none focus:ring-0 active:outline-none"
                        aria-haspopup="menu"
                        aria-expanded={openMenuId === rowKey}
                      >
                        <FaEllipsisV className="text-gray-600" />
                      </button>
                      {openMenuId === rowKey && (
                        <div className="origin-top-right absolute right-0 mt-2 w-36 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onRestore(item);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              Restore
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                // Placeholder for view action
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                onDelete(item);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td
                colSpan={6}
                className="text-center py-12 text-gray-500 italic text-lg bg-white rounded-b-xl"
              >
                No archived records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ArchiveTable;
