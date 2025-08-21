const LoginForm = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Panel */}
      <div className="w-1/2 bg-gray-200 flex flex-col items-center justify-center px-8">
        <img
          src="/assets/logo.png" // 🔁 Replace with your actual logo path (e.g., public folder)
          alt="School Logo"
          className="w-28 mb-10"
        />

        <form className="w-full max-w-sm flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-gray-300 placeholder-gray-700 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-gray-300 placeholder-gray-700 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gray-400 hover:bg-gray-500 text-white text-xl rounded-xl w-12 h-12 mx-auto flex items-center justify-center"
          >
            ➤
          </button>
        </form>

        <a href="#" className="mt-4 text-sm text-sky-600 hover:underline">
          Can't log in?
        </a>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-gray-300" />
    </div>
  );
};

export default LoginForm;
