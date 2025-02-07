import { createBrowserRouter } from "react-router-dom";
import Root from "./layout/Root";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Dogs from "./pages/dogs/Dogs";
import DogsMatch from "./pages/dogs/DogsMatch";
import DogsSearch from "./pages/dogs/DogsSearch";
import Error from "./pages/error/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dogs",
        element: <Dogs />,
        children: [
          { path: "search", element: <DogsSearch /> },
          { path: "match", element: <DogsMatch /> },
        ],
      },
    ],
  },
]);

export default router;
