import { useLocation, useNavigate } from "react-router-dom";
import "./../css/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const postLogout = async () => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );
      console.log(response);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      navigate("/login?logout=true");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-site-info">
        <img
          width={96}
          height={96}
          src={new URL("./../assets/logo.svg", import.meta.url).href}
          alt="Site logo"
        />
        Adopt-A-Dog
      </div>
      {location.pathname.substring(0, 5) === "/dogs" && (
        <menu>
          <li onClick={postLogout}>Log Out</li>
        </menu>
      )}
    </nav>
  );
};

export default Navbar;
