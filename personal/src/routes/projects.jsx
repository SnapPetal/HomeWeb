import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function Projects() {
  return (
    <Box
      className="Projects"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          Projects
        </Typography>
        <Typography variant="body1" gutterBottom>
          Here are some of our latest projects:
        </Typography>
        {/* Add your project cards or list here */}
      </Container>
    </Box>
  );
}
