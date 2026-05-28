import { useAuth } from "../context/AuthContext";

export const useRegister = () => {
  const { register } = useAuth();
  return register;
};
