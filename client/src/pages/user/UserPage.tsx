import { useState } from "react";
import Boxbar from "../../layout/Boxbar";

export default function UserPage() {
  // Dummy user data for UI only
  const UserPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
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

  return (
    <>
      <Boxbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => setIsAddModalOpen(true)}
      />

      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md space-y-6">
        <h1 className="text-2xl font-bold">User List</h1>

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
            {users.map((user) => (
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
    </>
  );
};
}
