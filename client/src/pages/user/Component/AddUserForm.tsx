import { useState } from "react";

export default function CreateUserPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department_id: "",
  });

  // Dummy departments for UI only
  const departments = [
    { id: 1, name: "IT Department" },
    { id: 2, name: "HR Department" },
    { id: 3, name: "Finance Department" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(
      `User Created!\nName: ${form.name}\nEmail: ${form.email}\nDept ID: ${form.department_id}`
    );
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold">Create User</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          className="w-full p-2 border rounded"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        <select
          className="w-full p-2 border rounded"
          name="department_id"
          value={form.department_id}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
