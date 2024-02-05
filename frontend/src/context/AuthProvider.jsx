import { createContext, useState } from "react";

const AuthContext = createContext({});

// children are components nested inside the AuthProvider
// they will be provided with this context
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({});

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
