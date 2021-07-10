import React from 'react';
import axios from 'axios';
import { useQuery } from "react-query";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Loader from './Loader';

const fetchBibleVerse = async () => {
    return await axios.get('https://quotes.rest/bible/vod.json');
};

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    container: {
        margin: 'auto',
        maxWidth: 360,
    }
});

export default function BibleVerse() {
    const { data } = useQuery("verse", fetchBibleVerse);
    const classes = useStyles();

    if (!data) return <Loader />
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <Typography variant="subtitle2" component="h1" align="center">
                    Verse of the Day
                </Typography>
                <Typography variant="subtitle2" component="h2" align="center">
                    {data.data.contents.verse}
                </Typography>
            </div>
        </div>
    );
}