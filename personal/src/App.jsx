import React, { useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useLoaderData,
} from "react-router-dom";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import BibleCard from "./components/BibleCard/index";
import "./App.css";

import "./index.css";

let router = createBrowserRouter([
  {
    path: "/",
    Component() {
      return (
        <Box
          className="App"
          display="flex"
          flexDirection="column"
          alignItems="center"
          width="100vw"
          height="100vh"
          bgcolor="#f5f5f5"
        >
          <AppBar position="static" color="primary">
            <Toolbar>
              <Typography variant="h6" component="div">
                Thon Becker
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            width="100%"
            height="90vh"
          >
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="10vh"
            ></Box>
          </Box>
        </Box>
      );
    },
  },
]);

export default function App() {
  return <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />;
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => router.dispose());
}
