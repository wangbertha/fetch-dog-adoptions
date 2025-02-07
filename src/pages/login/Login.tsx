import { useState } from "react";
import "./../../css/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  const postLogin = async (e): Promise<void> => {
    e.preventDefault();

    navigate("/dogs/search");
  };

  return (
    <div className="page login-page">
      <div className="login-wrapper">
        <h1>Login</h1>
        <div className="login-message">
          <p>Log in with your name and email below.</p>
          <p>No previous account is necessary.</p>
        </div>
        <form onSubmit={postLogin}>
          <label>
            <div>Name</div>
            <input type="text" onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            <div>Email</div>
            <input type="email" onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit">Log In</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
