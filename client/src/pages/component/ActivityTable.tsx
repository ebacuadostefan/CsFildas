import React from "react";

type Activity = {
  id: number;
  name: string; // action/message
  time: string;
  date: string;
  status: "created" | "updated" | "deleted";
};

type Props = {
  activities: Activity[];
};

const ActivityTable: React.FC<Props> = ({ activities }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-center border border-gray-300">
        <thead className="bg-gray-300 text-xs uppercase font-medium">
          <tr>
            <th className="px-4 py-3 border border-gray-300">No</th>
            <th className="px-4 py-3 border border-gray-300">Action</th>
            <th className="px-4 py-3 border border-gray-300">Time</th>
            <th className="px-4 py-3 border border-gray-300">Date</th>
            <th className="px-4 py-3 border border-gray-300">Status</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((activity, index) => (
            <tr
              key={activity.id}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"}
            >
              <td className="px-4 py-3 border border-gray-300">{index + 1}</td>
              <td className="px-4 py-3 border border-gray-300">
                {activity.name}
              </td>
              <td className="px-4 py-3 border border-gray-300">
                {activity.time}
              </td>
              <td className="px-4 py-3 border border-gray-300">
                {activity.date}
              </td>
              <td className="px-4 py-3 border border-gray-300">
                <span
                  className={`px-3 py-1 rounded-full text-white font-semibold ${
                    activity.status === "created"
                      ? "bg-green-500"
                      : activity.status === "updated"
                      ? "bg-blue-500"
                      : "bg-red-600"
                  }`}
                >
                  {activity.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivityTable;
