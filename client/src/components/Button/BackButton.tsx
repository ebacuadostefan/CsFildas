import { useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="px-3 py-1 border text-1xl border-gray-300 rounded hover:bg-gray-100 transition text-gray-600"
    >
      ◄
    </button>
  );
};

export default BackButton;
