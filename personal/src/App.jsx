import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root";
import Contact from "./routes/contact";
import About from "./routes/about";
import Projects, { loader as projectsLoader } from "./routes/projects";
import Loader from "./components/Loader";
import Error from "./components/Error";
import "./App.css";

let router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    loader: rootLoader,
    children: [
      {
        path: "projects",
        loader: projectsLoader,
        element: <Projects />,
        errorElement: <Error />,
      },
      {
        path: "contact",
        element: <Contact />,
        errorElement: <Error />,
      },
      {
        path: "about",
        element: <About />,
        errorElement: <Error />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<Loader />} />;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
