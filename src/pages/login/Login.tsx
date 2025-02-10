import { FormEvent, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import "./../../css/Login.css";

/**
 * Login page; If successful, navigates to "/dogs/search" page
 */
const Login = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const redirectParams = searchParams.get("redirect");
  const logoutParams = searchParams.get("logout");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [responseMessage, setResponseMessage] = useState<string>(
    redirectParams?.substring(redirectParams.length - 3) === "401"
      ? `Previous page was unauthorized. Please log in to continue. (${redirectParams})`
      : redirectParams
      ? "An error occurred on the previous page."
      : logoutParams
      ? "You have been successfully logged out."
      : ""
  );

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
      setResponseMessage(`Login was unsuccessful. (${error})`);
    }
  };

  return (
    <div className="page login-page">
      <div className="login-wrapper">
        <h1>Login</h1>
        <div className="login-message">
          <p>Log in with your name and email below.</p>
          <p>No previous account is necessary.</p>
          <p>Email format: _____@__.__</p>
        </div>
        <form onSubmit={(e) => postLogin(e)}>
          <label>
            <div>Name</div>
            <input
              type="text"
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <label>
            <div>Email</div>
            <input
              type="text"
              pattern="^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <button type="submit">Log In</button>
          <p>{responseMessage}</p>
        </form>
      </div>
    </div>
  );
};

export default Login;
