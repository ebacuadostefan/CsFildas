import { useNavigate, useParams, useLocation } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const { slug } = useParams(); // department slug
  const location = useLocation();

  const handleBack = () => {
    // If inside a folder -> go back to department folder list
    if (location.pathname.includes("/folders/")) {
      navigate(`/departments/${slug}`);
    } else {
      // otherwise just go back in history
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleBack}
      className="px-3 py-1 border shadow-md text-1xl border-gray-300 rounded hover:bg-gray-100 transition text-gray-600"
    >
      ◄
    </button>
  );
};

export default BackButton;
