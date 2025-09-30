import { useState } from "react";
import Boxbar from "../../layout/Boxbar";

const UserPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Dummy user data for UI only
  const users = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      department: "IT Department",
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      department: "HR Department",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      department: "Finance Department",
    },
  ];

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Boxbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setIsAddModalOpen(true)}
      />

      <div className="mt-10 w-fullbg-white rounded-xl shadow-md space-y-6">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Department
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {user.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.email}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {user.department}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal placeholder */}
      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold">Add User</h2>
            <button
              className="mt-4 px-3 py-1 bg-gray-200 rounded"
              onClick={() => setIsAddModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPage;
