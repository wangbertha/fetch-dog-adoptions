import { Link } from "react-router-dom";

import "../../css/Home.css";

/**
 * Home screen at root path
 */
const Home = () => {
  return (
    <div className="page home-page">
      <h1>Welcome to Adopt-A-Dog!</h1>
      <p>To start your adoption journey, login here:</p>
      <Link to="/login">
        <button>Log In</button>
      </Link>
    </div>
  );
};

export default Home;
