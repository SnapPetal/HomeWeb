import React from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

export async function loader() {
  const response = await fetch("https://bibleverse.thonbecker.com/");
  const verse = await response.json();
  return verse;
}

export default function Root() {
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
}
