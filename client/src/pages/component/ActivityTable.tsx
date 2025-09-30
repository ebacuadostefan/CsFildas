import React from "react";
import type { Activity } from "../../services/ActivityServices";

type Props = {
  activities: Activity[];
};

// FIX: Set default value for activities to an empty array ([]) to prevent the TypeError
const ActivityTable: React.FC<Props> = ({ activities = [] }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500 bg-white rounded-xl shadow-lg">
        No recent activities found.
      </div>
    );
  }

  // Helper to determine badge color based on action
  const getStatusClasses = (action: Activity["action"]) => {
    switch (action) {
      case "created":
        return "bg-green-500 hover:bg-green-600";
      case "updated":
        return "bg-blue-500 hover:bg-blue-600";
      case "deleted":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="overflow-x-auto shadow-xl rounded-xl">
      <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
        <thead className="bg-white shadow-lg text-xs uppercase text-gray-800 font-semibold sticky top-0">
          <tr>
            <th className="p-3 whitespace-nowrap">#</th>
            <th className="p-3 text-left">Department</th>
            <th className="p-3 text-left">Item</th>
            <th className="p-3">Action</th>
            <th className="p-3">Date</th>
            <th className="p-3">Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {activities.map((activity, index) => {
            const dateObj = activity.created_at
              ? new Date(activity.created_at)
              : null;

            return (
              <tr
                key={activity.id}
                className="transition-all hover:bg-blue-50/50"
              >
                <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                  {index + 1}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-left text-gray-700 font-medium">
                  {activity.department?.name || "N/A"}
                </td>
                <td className="px-4 py-3 text-left font-medium text-gray-900">
                  <span className="font-mono text-xs text-gray-500 mr-2">
                    [{activity.type.toUpperCase()}]
                  </span>
                  {activity.name || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span
                    className={`px-3 py-1 text-xs rounded-full uppercase text-white font-bold transition-colors ${getStatusClasses(
                      activity.action
                    )}`}
                  >
                    {activity.action}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {dateObj?.toLocaleDateString() || "-"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-gray-600">
                  {dateObj?.toLocaleTimeString() || "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
