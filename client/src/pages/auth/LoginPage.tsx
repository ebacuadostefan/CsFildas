import LoginFormUI from "./LoginForm/LoginForm";
import { useLoginForm } from "../../services/LoginServices";
import type { FC } from "react";


const LoginPage: FC = () => {
  const { credentials, errors, loading, handleChange, handleSubmit } = useLoginForm();

  return (
    <LoginFormUI
      credentials={credentials}
      errors={errors}
      loading={loading}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  );
};

export default LoginPage;
