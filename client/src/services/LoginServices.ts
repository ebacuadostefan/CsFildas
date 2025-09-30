import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AxiosInstance from "./AxiosInstances";


export type LoginCredentials = {
  email: string;
  password: string;
};

export type LoginErrors = Partial<Record<"email" | "password" | "general", string>>;

export const useLoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({ email: "", password: "" });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      // Single legacy login endpoint for simplicity
      const { data } = await AxiosInstance.post("/login", credentials);
      localStorage.setItem("token", data.token);
      AxiosInstance.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
      if (data.user) {
        localStorage.setItem("user", JSON.stringify({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
        }));
      }
      navigate('/dashboard');
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Invalid email or password";
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return { credentials, errors, loading, handleChange, handleSubmit };
};
