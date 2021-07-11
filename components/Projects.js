import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Divider from '@material-ui/core/Divider';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  container: {
    margin: 'auto',
    maxWidth: 600,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function Projects() {
  const classes = useStyles();
  const preventDefault = (event) => event.preventDefault();

  return (
    <div className={classes.root}>
      <List className={classes.container}>
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Github" src="/images/Octocat.png" />
          </ListItemAvatar>
          <ListItemText
            primary="Github Projects"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  display="block"
                >
                  <Link
                    href="https://github.com/SnapPetal/cdk-simplewebsite-deploy"
                    target="_blank"
                    onClick={preventDefault}>
                    NPM Package - CDK Constructor
                  </Link>
                </Typography>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  display="block"
                >
                  <Link
                    href="https://github.com/SnapPetal/HomeWeb"
                    target="_blank"
                    onClick={preventDefault}>
                    Personal Site - Next.js
                  </Link>
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
        <Divider variant="inset" component="li" />
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt="Travis Howard" src="/images/android.png" />
          </ListItemAvatar>
          <ListItemText
            primary="Mobile Apps"
            secondary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  display="block"
                >
                  <Link
                    href="https://play.google.com/store/apps/details?id=org.valorskateandserve.app"
                    target="_blank"
                    onClick={preventDefault}>
                    Valor Skate & Serve
                  </Link>
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      </List>
    </div>
  );
}