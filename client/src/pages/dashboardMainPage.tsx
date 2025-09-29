import type { JSX } from "react";
import {
  FaCheckCircle,
  FaFileAlt,
  FaClipboardList,
  FaUserShield,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="p-15 max-w-7xl mx-auto space-y-10">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">📊 QA Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard
          title="Total Audits"
          value={13}
          subtitle="Completed this month"
          icon={<FaCheckCircle />}
          color="green"
          progress={80}
        />
        <StatCard
          title="Pending Reports"
          value={5}
          subtitle="Needs review"
          icon={<FaFileAlt />}
          color="red"
          progress={40}
        />
        <StatCard
          title="QA Officers"
          value={4}
          subtitle="Active personnel"
          icon={<FaUserShield />}
          color="blue"
          progress={100}
        />
        <StatCard
          title="Documents Reviewed"
          value={27}
          subtitle="Reviewed this quarter"
          icon={<FaClipboardList />}
          color="indigo"
          progress={65}
        />
      </div>

      {/* Charts Section - Temporarily disabled until recharts is installed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart - Audits Completed Over Time */}
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Audits Over Time
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Charts will appear here after installing recharts package
          </div>
        </div>

        {/* Bar Chart - Pending vs Completed Reports */}
        <div className="bg-white p-5 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Reports Status
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Charts will appear here after installing recharts package
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="mt-12 bg-blue-50 border-t border-blue-200 rounded-xl p-6 text-center shadow-inner">
        <h2 className="text-2xl font-bold text-blue-700">FILDAS</h2>
        <p className="text-gray-600 mt-2 max-w-2xl mx-auto">
          FILDAS (Filamer Quality Assurance System) is designed to ensure
          academic and institutional excellence through systematic audits,
          reporting, and monitoring. Our mission is to promote transparency,
          consistency, and continuous improvement across all quality assurance
          processes.
        </p>
        <p className="text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} FILDAS - Quality Assurance System. All
          rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;

// Reusable Stat Card Component
const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  color,
  progress = 0,
}: {
  title: string;
  value: number;
  subtitle?: string;
  icon: JSX.Element;
  color: string;
  progress?: number; // percentage
}) => {
  const colorClasses = {
    red: { text: "text-red-600", bg: "bg-red-50", border: "border-red-400" },
    blue: {
      text: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-400",
    },
    green: {
      text: "text-green-600",
      bg: "bg-green-50",
      border: "border-green-400",
    },
    indigo: {
      text: "text-indigo-600",
      bg: "bg-indigo-50",
      border: "border-indigo-400",
    },
  }[color] || {
    text: "text-gray-600",
    bg: "bg-gray-50",
    border: "border-gray-400",
  };

  return (
    <div
      className={`bg-white shadow-lg rounded-xl p-5 flex flex-col justify-between border-l-4 ${colorClasses.border} hover:shadow-2xl transition-all duration-300`}
    >
      <div className="flex items-center mb-3">
        <div className={`text-3xl mr-4 ${colorClasses.text}`}>{icon}</div>
        <div>
          <div className="text-gray-600 font-semibold">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
      </div>

      {subtitle && <div className="text-gray-500 text-sm mb-2">{subtitle}</div>}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-2 rounded-full ${colorClasses.text}`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="text-gray-500 text-xs mt-1">{progress}% completed</div>
    </div>
  );
};
