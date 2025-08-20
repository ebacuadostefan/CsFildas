import type { JSX } from "react";
import { FaFileAlt, FaFolder, FaUser, FaFile } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="p-15 max-w-7xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold text-blue-700">📊 My Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Documents"
          value={13}
          icon={<FaFileAlt />}
          color="red"
        />
        <StatCard
          title="Total Document Type"
          value={13}
          icon={<FaFolder />}
          color="blue"
        />
        <StatCard
          title="Total Admin"
          value={4}
          icon={<FaUser />}
          color="green"
        />
        <StatCard
          title="Total of All Documents"
          value={27}
          icon={<FaFile />}
          color="indigo"
        />
      </div>
    </div>
  );
};

export default Dashboard;

// Reusable Stat Card Component
const StatCard = ({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  color: string;
}) => {
  const colorClasses = {
    red: "text-red-500 border-red-200",
    blue: "text-blue-500 border-blue-200",
    green: "text-green-500 border-green-200",
    indigo: "text-indigo-500 border-indigo-200",
  }[color];

  return (
    <div
      className={`bg-white shadow rounded p-4 flex items-center border-l-4 ${colorClasses}`}
    >
      <div className="text-2xl mr-4">{icon}</div>
      <div>
        <div className="text-sm text-gray-500">{title}</div>
        <div className="text-xl font-bold">{value}</div>
      </div>
    </div>
  );
};
