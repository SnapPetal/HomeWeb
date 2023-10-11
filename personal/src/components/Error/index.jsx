import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function ErrorPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100vw"
      height="100vh"
      bgcolor="#f5f5f5"
      margin="auto"
    >
      <Typography variant="h1">Oops!</Typography>
      <Typography variant="h4">Something went wrong.</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => window.location.reload()}
      >
        Refresh
      </Button>
    </Box>
  );
}
