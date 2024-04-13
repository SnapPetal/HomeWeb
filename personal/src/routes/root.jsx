import React from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Grid } from "@mui/material";
import {
  Folder,
  GitHub,
  Home,
  LinkedIn,
  Mail,
  Person,
} from "@mui/icons-material";
import BibleVerse from "../components/BibleCard/index";

export async function loader() {
  let cache = sessionStorage.getItem("verseCache");
  if (cache) {
    return JSON.parse(cache);
  }

  let retries = 3;
  while (retries > 0) {
    try {
      const response = await fetch("https://bibleverse.thonbecker.com/");
      const verse = await response.json();
      sessionStorage.setItem("verseCache", JSON.stringify(verse));
      return verse;
    } catch (error) {
      console.error(`Failed to fetch, attempts left: ${retries - 1}`, error);
      retries--;
      if (retries === 0) {
        throw error;
      }
    }
  }
}

const drawerWidth = 240;

export default function Root() {
  const bibleData = useLoaderData();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <ListItem disablePadding>
        <ListItemButton href="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton href="/projects">
          <ListItemIcon>
            <Folder />
          </ListItemIcon>
          <ListItemText primary="Projects" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton href="/about">
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText primary="About" />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton href="/contact">
          <ListItemIcon>
            <Mail />
          </ListItemIcon>
          <ListItemText primary="Contact" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton href="https://github.com/SnapPetal" target="_blank">
            <ListItemIcon>
              <GitHub />
            </ListItemIcon>
            <ListItemText primary="Github" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            href="https://www.linkedin.com/in/thon-becker-66600947/"
            target="_blank"
          >
            <ListItemIcon>
              <LinkedIn />
            </ListItemIcon>
            <ListItemText primary="LinkedIn" />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Thon Becker - Personal Website
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { xs: "100%", sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          onClick={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: { xs: "100%", sm: drawerWidth },
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: { xs: "100%", sm: drawerWidth },
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { xs: "100%", sm: `calc(100% - ${drawerWidth}px)` },
          flexShrink: 1,
        }}
      >
        <Toolbar />
        <Grid container spacing={2} sx={{ display: "flex", flexWrap: "wrap" }}>
          <Grid item xs={12}>
            <Outlet />
          </Grid>
          <Grid item xs={12}>
            <Box
              display="flex"
              justifyContent="center"
              sx={{ flexWrap: "wrap" }}
            >
              <BibleVerse {...bibleData} />
            </Box>
          </Grid>
        </Grid>
        <Box
          display="flex"
          justifyContent="center"
          p={2}
          sx={{ flexWrap: "wrap" }}
        >
          <Typography variant="body2" color="textSecondary" align="center">
            {"Copyright © "}
            {new Date().getFullYear()}
            {" Thon Becker"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
