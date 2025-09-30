import { useEffect, useState } from "react";
import Boxbar from "../../layout/Boxbar";
import UserServices, {
  type CreateUserPayload,
  type DepartmentOption,
} from "../../services/UserServices";

const UserPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [users, setUsers] = useState<
    Array<{
      id: number;
      name: string;
      email: string;
      department?: { id: number; name: string };
    }>
  >([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [form, setForm] = useState<CreateUserPayload>({
    name: "",
    email: "",
    password: "",
    department_id: 0,
  });

  useEffect(() => {
    (async () => {
      try {
        const [dept, usr] = await Promise.all([
          UserServices.listDepartments(),
          UserServices.listUsers(),
        ]);
        setDepartments(dept);
        setUsers(usr);
      } catch (e) {
        console.error("Failed to load users/departments", e);
      }
    })();
  }, []);

  // After creating a user, persist a minimal user object to localStorage to scope access on the client
  const persistSessionUser = (user: {
    id: number;
    name: string;
    email: string;
    department?: { id: number; name: string };
  }) => {
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email,
      department_id: user.department?.id ?? null,
    };
    localStorage.setItem("user", JSON.stringify(payload));
  };

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
                  {user.department?.name || ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add User</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const created = await UserServices.createUser(form);
                  setUsers((prev) => [...prev, created]);
                  // Optionally sign-in as the created user or persist for demonstration
                  persistSessionUser(created);
                  setIsAddModalOpen(false);
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    department_id: 0,
                  });
                } catch (err) {
                  console.error("Failed to create user", err);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Full Name
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">
                  Department
                </label>
                <select
                  value={form.department_id}
                  onChange={(e) =>
                    setForm({ ...form, department_id: Number(e.target.value) })
                  }
                  className="w-full border rounded px-3 py-2"
                  required
                >
                  <option value={0} disabled>
                    Select department
                  </option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-3 py-1 bg-gray-200 rounded"
                  onClick={() => setIsAddModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default UserPage;
