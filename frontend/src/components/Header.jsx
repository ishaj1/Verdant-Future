import { Link } from "react-router-dom";

export default function Header({
  isLoggedIn,
  setIsLoggedIn,
  userInformation,
  setUserInformation,
}) {
  const logout = () => {
    setUserInformation({});
    setIsLoggedIn(false);
  };
  return (
    <header>
      <nav>
        {isLoggedIn && <Link to="/projects">Organizations Directory</Link>}
        {isLoggedIn && (
          <Link to={`/profile/${userInformation.username}`}>Profile</Link>
        )}
        {isLoggedIn && <button onClick={logout}>Logout</button>}
      </nav>
    </header>
  );
}
