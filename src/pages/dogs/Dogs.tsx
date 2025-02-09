import { Outlet } from "react-router-dom";

const Dogs = () => {
  return (
    <div className="page">
      <h1>Dog Match Process</h1>
      <Outlet />
    </div>
  );
};

export default Dogs;
