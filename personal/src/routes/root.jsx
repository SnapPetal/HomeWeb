import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  AppBar,
  Toolbar,
  Button,
  IconButton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { GitHub, LinkedIn } from "@mui/icons-material";
import BibleVerse from "../components/BibleCard/index";
export async function loader() {
  const response = await fetch("https://bibleverse.thonbecker.com/");
  const verse = await response.json();
  return verse;
}

export default function Root() {
  const bibleData = useLoaderData();
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Thon Becker - Personal Website
          </Typography>
          <Button component={Link} to="/" color="inherit">
            Home
          </Button>
          <Button component={Link} to="/projects" color="inherit">
            Projects
          </Button>
          <Button component={Link} to="/about" color="inherit">
            About
          </Button>
          <Button component={Link} to="/contact" color="inherit">
            Contact
          </Button>
          <IconButton
            href="https://github.com/SnapPetal"
            target="_blank"
            color="inherit"
          >
            <GitHub />
          </IconButton>
          <IconButton
            href="https://www.linkedin.com/in/thon-becker-9a7a7b1b5/"
            target="_blank"
            color="inherit"
          >
            <LinkedIn />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Outlet />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <BibleVerse {...bibleData} />
          </Box>
        </Grid>
      </Grid>
      <Box display="flex" justifyContent="center" p={2}>
        <Typography variant="body2" color="textSecondary" align="center">
          {"Copyright © "}
          {new Date().getFullYear()}
          {" Thon Becker"}
        </Typography>
      </Box>
    </Box>
  );
}
