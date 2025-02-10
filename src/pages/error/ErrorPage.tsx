import { Link } from "react-router-dom";

/**
 * Error page for invalid URL paths
 */
const ErrorPage = () => {
  return (
    <div className="page">
      <div>This page is not available :(</div>
      <Link to="/">Return Home</Link>
    </div>
  );
};

export default ErrorPage;
