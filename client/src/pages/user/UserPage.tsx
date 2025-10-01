import { useEffect, useState } from "react";
import Boxbar from "../../layout/Boxbar";
import UserServices, {
  type CreateUserPayload,
  type DepartmentOption,
} from "../../services/UserServices";
import Spinner from "../../components/Spinner/Spinner";

const UserPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id: number;
    name: string;
    email: string;
    department_id: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
      setIsLoading(true);
      setError(null);
      try {
        const [dept, usr] = await Promise.all([
          UserServices.listDepartments(),
          UserServices.listUsers(),
        ]);
        setDepartments(dept);
        setUsers(usr);
      } catch (e) {
        console.error("Failed to load users/departments", e);
        setError("Failed to load users and departments. Please try again.");
      } finally {
        setIsLoading(false);
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

  const handleEditUser = (user: any) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      department_id: user.department?.id || 0,
    });
    setForm({
      name: user.name,
      email: user.email,
      password: "", // Don't pre-fill password for security
      department_id: user.department?.id || 0,
    });
    setIsEditing(true);
    setIsAddModalOpen(true);
  };

  const handleDeleteUser = async (userId: number, userName: string) => {
    if (
      !window.confirm(`Are you sure you want to delete user "${userName}"?`)
    ) {
      return;
    }

    try {
      // TODO: Implement delete API call
      // await UserServices.deleteUser(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSuccess(`User "${userName}" deleted successfully!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to delete user. Please try again."
      );
    }
  };

  return (
    <>
      <Boxbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onAdd={() => {
          setIsEditing(false);
          setEditingUser(null);
          setForm({
            name: "",
            email: "",
            password: "",
            department_id: 0,
          });
          setIsAddModalOpen(true);
        }}
      />

      {/* Success Message */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Add User Button - More Visible */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => {
            setIsEditing(false);
            setEditingUser(null);
            setForm({
              name: "",
              email: "",
              password: "",
              department_id: 0,
            });
            setIsAddModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New User
        </button>
      </div>

      <div className="mt-10 w-full bg-white rounded-xl shadow-md space-y-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-red-600 text-center p-10 bg-red-100 border border-red-300 rounded-lg mx-auto max-w-lg">
            {error}
          </div>
        ) : (
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
                <th className="border border-gray-300 px-4 py-2 text-left">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="border border-gray-300 px-4 py-8 text-center text-gray-500"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-2">
                      {user.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.email}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.department?.name || "No Department"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <div className="flex gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-800 text-sm"
                          onClick={() => handleEditUser(user)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 text-sm"
                          onClick={() => handleDeleteUser(user.id, user.name)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isAddModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {isEditing ? "Edit User" : "Add User"}
              </h2>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setError(null);
                  setSuccess(null);
                  setIsEditing(false);
                  setEditingUser(null);
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    department_id: 0,
                  });
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setIsCreating(true);
                setError(null);
                setSuccess(null);

                try {
                  if (isEditing && editingUser) {
                    // TODO: Implement update API call
                    // const updated = await UserServices.updateUser(editingUser.id, form);
                    setUsers((prev) =>
                      prev.map((user) =>
                        user.id === editingUser.id
                          ? {
                              ...user,
                              name: form.name,
                              email: form.email,
                              department: departments.find(
                                (d) => d.id === form.department_id
                              ),
                            }
                          : user
                      )
                    );
                    setSuccess(`User "${form.name}" updated successfully!`);
                  } else {
                    const created = await UserServices.createUser(form);
                    setUsers((prev) => [...prev, created]);
                    setSuccess(
                      `User "${created.name}" created successfully! They can now log in with their credentials.`
                    );
                  }

                  // Reset form and close modal
                  setForm({
                    name: "",
                    email: "",
                    password: "",
                    department_id: 0,
                  });
                  setIsEditing(false);
                  setEditingUser(null);

                  // Close modal after a short delay to show success message
                  setTimeout(() => {
                    setIsAddModalOpen(false);
                  }, 1500);
                } catch (err: any) {
                  console.error("Failed to save user", err);
                  setError(
                    err.response?.data?.message ||
                      `Failed to ${
                        isEditing ? "update" : "create"
                      } user. Please try again.`
                  );
                } finally {
                  setIsCreating(false);
                }
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email address"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password{" "}
                  {!isEditing && <span className="text-red-500">*</span>}
                  {isEditing && (
                    <span className="text-gray-500 text-xs">
                      (leave blank to keep current)
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required={!isEditing}
                  minLength={6}
                  placeholder={
                    isEditing
                      ? "Enter new password or leave blank"
                      : "Enter password (min 6 characters)"
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Department *
                </label>
                <select
                  value={form.department_id}
                  onChange={(e) =>
                    setForm({ ...form, department_id: Number(e.target.value) })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <p className="text-xs text-gray-500 mt-1">
                  This determines which department the user can access
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setError(null);
                    setSuccess(null);
                    setIsEditing(false);
                    setEditingUser(null);
                    setForm({
                      name: "",
                      email: "",
                      password: "",
                      department_id: 0,
                    });
                  }}
                  disabled={isCreating}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Spinner size="sm" />
                    </>
                  ) : isEditing ? (
                    "Update User"
                  ) : (
                    "Create User"
                  )}
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
