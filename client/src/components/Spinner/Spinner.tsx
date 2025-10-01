import type { FC } from "react";

interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg";
}

const Spinner: FC<SpinnerProps> = ({ size }) => {
  const spinnerSize =
    size === "xs"
      ? "h-4 w-4"
      : size === "sm"
      ? "h-6 w-6"
      : size === "md"
      ? "h-8 w-8"
      : size === "lg"
      ? "h-10 w-10"
      : "h-8 w-8"; // Default to md size if none is provided

  return (
    <div className="flex items-center justify-center">
      <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${spinnerSize}`}></div>
      <span className="ml-3 text-blue-500 font-medium">Loading...</span>
    </div>
  );
};

export default Spinner;