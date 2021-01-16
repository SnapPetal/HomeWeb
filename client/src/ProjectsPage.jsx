import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ExtensionIcon from '@material-ui/icons/Extension';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        marginTop: 15,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 400,
    },
    img: {
        marginRight: 15,
    },
    button: {
        marginTop: 15,
        marginBottom: 10,
    }
}));

export default function ProjectsPage() {
    const classes = useStyles();
    const [spacing] = React.useState(4);

    return (
        <Grid container className={classes.root} spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="center" spacing={spacing}>
                    <Grid item>
                        <Paper className={classes.paper} >
                            <Grid item className={classes.img} >
                                <ExtensionIcon style={{ fontSize: 40 }}/>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <Typography gutterBottom variant="subtitle1">
                                            CDK Simple Website Package
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            AWS CDK Construct to simplify deploying a single-page website use CloudFront distributions.
                                        </Typography>
                                        <Button className={classes.button} variant="contained" color="primary" target="_blank" href="https://github.com/SnapPetal/cdk-simplewebsite-deploy">
                                            Project Site
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper} >
                            <Grid item className={classes.img}>
                                <ExtensionIcon style={{ fontSize: 40 }}/>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <Typography gutterBottom variant="subtitle1">
                                            Valor Skate & Serve Mobile Application
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            Valor Skate & Serve is a community app for skateboarders.
                                        </Typography>
                                        <Button className={classes.button} variant="contained" color="primary" target="_blank" href="https://play.google.com/store/apps/details?id=org.valorskateandserve.app">
                                            Android Application
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>    
                    </Grid>
                    <Grid item>
                        <Paper className={classes.paper} >
                            <Grid item className={classes.img}>
                                <ExtensionIcon style={{ fontSize: 40 }}/>
                            </Grid>
                            <Grid item xs={12} sm container>
                                <Grid item xs container direction="column" spacing={2}>
                                    <Grid item xs>
                                        <Typography gutterBottom variant="subtitle1">
                                            Becker Games
                                        </Typography>
                                        <Typography variant="body2" gutterBottom>
                                            Independent game development projects 
                                        </Typography>
                                        <Button className={classes.button} variant="contained" color="primary" target="_blank" href="http://beckergames.net">
                                            Project Site
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}
