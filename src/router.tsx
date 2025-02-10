import { createBrowserRouter } from "react-router-dom";
import Root from "./layout/Root";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Dogs from "./pages/dogs/Dogs";
import DogsMatch from "./pages/dogs/DogsMatch";
import DogsSearch from "./pages/dogs/DogsSearch";
import Error from "./pages/error/ErrorPage";
import ErrorPage from "./pages/error/ErrorPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <Error />,
      },
      {
        path: "/login",
        element: <Login />,
        errorElement: <Error />,
      },
      {
        path: "/dogs",
        element: <Dogs />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "search",
            element: <DogsSearch />,
            errorElement: <ErrorPage />,
          },
          {
            path: "match",
            element: <DogsMatch />,
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
