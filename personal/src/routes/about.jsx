import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export default function About() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Container maxWidth="md">
        <Typography variant="h3" component="h1" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" gutterBottom>
          Hello, I&apos;m Thon Becker. I&apos;m a Software Engineer with 16
          years of experience. I specialize in Java Spring Boot. Feel free to
          contact me for any inquiries.
        </Typography>
      </Container>
    </Box>
  );
}
