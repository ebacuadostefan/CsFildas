import { FaChevronRight, FaHome } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../Button/BackButton";

// --- Mock Aliases/Lookup Data ---
// In a real application, this data would be fetched from your API/Redux/Context.
// This map allows us to convert the URL slug (key) into a human-readable name (value).
const ALIAS_MAP: { [key: string]: string } = {
  // Base Segments
  departments: "Departments",

  // Department Slugs (Example Data)
  css: "College of Computer Studies",
  ceas: "College of Engineering and Applied Sciences",

  // Folder/File Slugs (Example Data - Note: folders are filtered out anyway, but their children might need aliases)
  // Since folder slugs often represent names, we can rely on the clean-up function below
  // but if you needed a specific alias, you'd add it here:
  // "projects-2024": "2024 Projects Archive",
};

/**
 * Custom function to convert a URL slug (e.g., "college-of-computer-studies")
 * into a readable, capitalized string (e.g., "College Of Computer Studies").
 * If an alias exists in the ALIAS_MAP, it uses that instead.
 * @param slug The URL segment (slug).
 * @returns A user-friendly breadcrumb name.
 */
const getBreadcrumbName = (slug: string): string => {
  // 1. Check for a specific alias first
  if (ALIAS_MAP[slug]) {
    return ALIAS_MAP[slug];
  }

  // 2. Fallback: Clean up the slug (e.g., "project-2024" -> "Project 2024")
  // Replace all hyphens with spaces and capitalize the first letter of each word.
  return slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};
// ---------------------------------

const Breadcrumbs: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Split the current URL into parts and filter out empty strings
  const pathParts = location.pathname.split("/").filter(Boolean);

  // 2. Filter out structural segments we don't want to display
  // We only display a segment if it's NOT the word "folders"
  const displayParts = pathParts.filter((part) => part !== "folders");

  return (
    <div className="flex items-center text-sm text-gray-600 space-x-2">
      {/* Back Button */}
      <BackButton />

      <div className="flex items-center space-x-2">
        {/* Home Icon */}
        <FaHome
          className="text-blue-500 cursor-pointer"
          onClick={() => navigate("/dashboard")}
        />

        {/* Dynamic Path */}
        {displayParts.map((part, index) => {
          // 3. Reconstruct the full path from the ORIGINAL `pathParts`
          let fullPathSegments: string[] = [];
          let displayPartCount = 0;

          // Iterate through the *original* parts to reconstruct the correct URL
          // The goal is to build the URL piece by piece, including the "folders" segment,
          // but only increment the breadcrumb index for displayable parts.
          for (const originalPart of pathParts) {
            fullPathSegments.push(originalPart);

            if (originalPart !== "folders") {
              if (displayPartCount === index) {
                break; // Stop when we've reached the current breadcrumb index
              }
              displayPartCount++;
            }
          }

          const pathTo = "/" + fullPathSegments.join("/");
          const isLast = index === displayParts.length - 1;

          // Get the display name using the new function
          const displayName = getBreadcrumbName(part);

          return (
            <div key={index} className="flex items-center space-x-2">
              <FaChevronRight className="text-gray-400" />
              <span
                onClick={() => !isLast && navigate(pathTo)}
                className={`${
                  isLast
                    ? "text-blue-600 font-medium cursor-default"
                    : "text-gray-600 hover:text-blue-500 cursor-pointer"
                }`}
              >
                {/* Use the aliased/cleaned display name */}
                {displayName}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Breadcrumbs;
