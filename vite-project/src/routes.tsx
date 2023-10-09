import { Link, RouteObject } from "react-router-dom";

const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <div>
        <h1>Hello World</h1>
        <Link to="/about">About Us</Link>
      </div>
    ),
  },
  {
    path: "/about",
    element: <div>
      <h1>About</h1>
      <Link to="/">home</Link>
    </div>,
  },
];

export default routes;