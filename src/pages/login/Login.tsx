import { FormEvent, useState } from "react";
import "./../../css/Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>("");

  const navigate = useNavigate();

  const postLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + "/auth/login",
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email }),
          credentials: "include",
        }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      navigate("/dogs/search");
    } catch (error) {
      setResponseMessage(`Login was unsuccessful. ${error}`);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-wrapper">
        <h1>Login</h1>
        <div className="login-message">
          <p>Log in with your name and email below.</p>
          <p>No previous account is necessary.</p>
        </div>
        <form onSubmit={(e) => postLogin(e)}>
          <label>
            <div>Name</div>
            <input type="text" onChange={(e) => setName(e.target.value)} />
          </label>
          <label>
            <div>Email</div>
            <input type="email" onChange={(e) => setEmail(e.target.value)} />
          </label>
          <button type="submit">Log In</button>
          <p>{responseMessage}</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
