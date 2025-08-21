import type { FC } from "react";
import Filamer from "../../../assets/img/Filamer.jpg";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import SubmitButton from "../../../components/Button/SubmitButton";

interface LoginFormUIProps {
  credentials: { email: string; password: string };
  errors: any;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

const LoginFormUI: FC<LoginFormUIProps> = ({
  credentials,
  errors,
  loading,
  handleChange,
  handleSubmit,
}) => (
  <div className="flex h-screen font-sans bg-gray-50">
    {/* Left Panel */}
    <div className="w-full md:w-1/2 bg-white flex flex-col items-center justify-center px-8 md:px-16 shadow-xl">
      <img src={Filamer} alt="School Logo" className="w-24 md:w-28 mb-6" />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">
        Quality Assurance Portal
      </h1>
      <p className="text-gray-500 mb-8 text-center text-sm md:text-base">
        Sign in to access QA resources and school evaluation tools
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-5">
        <FloatingLabelInput
          label="Email"
          type="text"
          name="email"
          value={credentials.email}
          onChange={handleChange}
          errors={errors.email ? [errors.email] : []}
        />
        <FloatingLabelInput
          label="Password"
          type="password"
          name="password"
          value={credentials.password}
          onChange={handleChange}
          errors={errors.password ? [errors.password] : []}
        />
        {errors.general && <p className="text-sm text-red-500 text-center">{errors.general}</p>}

        <SubmitButton
          label="Log In"
          loading={loading}
          loadingLabel="Logging in..."
          className="bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg shadow-md transition-all duration-200"
        />
      </form>

      <a href="#" className="mt-4 text-sm text-blue-600 hover:underline transition">
        Can’t log in? Contact QA Office
      </a>
    </div>

    {/* Right Panel */}
    <div className="hidden md:flex w-1/2 bg-blue-700 relative items-center justify-center">
      <div className="text-center px-10 z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          School Quality Assurance
        </h2>
        <p className="text-lg text-blue-100 max-w-md mx-auto leading-relaxed">
          Ensuring academic excellence and institutional integrity. Access your QA dashboard to monitor, evaluate, and improve school performance.
        </p>
      </div>
      <div className="absolute inset-0 bg-blue-900 opacity-30"></div>
    </div>
  </div>
);

export default LoginFormUI;
