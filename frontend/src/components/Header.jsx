import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";

export default function Header() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const logout = useLogout();

  const signOut = async () => {
    await logout();
    navigate("/");
  };
  return (
    <header>
      <nav>
        {auth?.username && <Link to="/projects">Organizations Directory</Link>}
        {auth?.username && (
          <Link to={`/profile/${auth?.username}`}>Profile</Link>
        )}
        {auth?.username && <button onClick={signOut}>Logout</button>}
      </nav>
    </header>
  );
}
