import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root, { loader as rootLoader } from "./routes/root";
import Loader from "./components/Loader";
import Error from "./components/Error";
import "./App.css";

let router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error />,
    loader: rootLoader,
    children: [],
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<Loader />} />;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
