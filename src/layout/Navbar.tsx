import { NavLink } from "react-router-dom";
import "./../css/Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-site-info">
        <NavLink to="/">
          <img
            width={96}
            height={96}
            src={new URL("./../assets/logo.svg", import.meta.url).href}
            alt="Site logo"
          />
          Adopt-A-Dog
        </NavLink>
      </div>
      <menu>
        <li>
          <NavLink to="/login">Log Out</NavLink>
        </li>
      </menu>
    </nav>
  );
};

export default Navbar;
