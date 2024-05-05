import { createContext, useState } from "react";

const AuthContext = createContext({});

// children are components nested inside the AuthProvider
// they will be provided with this context
export const AuthProvider = ({ children }) => {
  let initial = {};
  const username = localStorage.getItem("username");
  const isProject = localStorage.getItem("isProject");
  if (username != null && isProject != null) {
    initial = { username, isProject: isProject === "true"};
  }
  const [auth, setAuth] = useState(initial);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
