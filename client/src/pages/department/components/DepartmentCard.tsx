import type { FC } from "react";
import type { Department } from "../../../interfaces/Department";


interface Props {
  department: Department;
}

const DepartmentCard: FC<Props> = ({ department }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center hover:shadow-lg transition">
      <div className="w-24 h-24 bg-gray-300 rounded-full mb-4" />
      <h3 className="text-lg font-semibold text-gray-800">{department.name}</h3>
    </div>
  );
};

export default DepartmentCard;
