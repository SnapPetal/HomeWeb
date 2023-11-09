import React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
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
          Contact
        </Typography>
        <Typography variant="body1" gutterBottom>
          Please fill out the form below to contact us.
        </Typography>
        <form noValidate autoComplete="off">
          <TextField label="Name" fullWidth margin="normal" />
          <TextField label="Email" fullWidth margin="normal" />
          <TextField
            label="Message"
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" type="submit">
            Submit
          </Button>
        </form>
      </Container>
    </Box>
  );
}
