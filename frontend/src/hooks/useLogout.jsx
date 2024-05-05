import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    localStorage.clear();
    setAuth({});
    // communicate logout with server
  };

  return logout;
};

export default useLogout;
