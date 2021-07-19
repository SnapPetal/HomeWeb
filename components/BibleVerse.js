import React from 'react';
import axios from 'axios';
import { useQuery } from "react-query";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Loader from './Loader';

const fetchBibleVerse = async () => {
    const response = await axios.get('https://quotes.rest/bible/vod.json');
    return response.data
};

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
        width: '100%',
    },
    container: {
        margin: 'auto',
        maxWidth: 500,
    }
});

export default function BibleVerse() {
    const { data, isLoading } = useQuery("verse", fetchBibleVerse);
    const classes = useStyles();
    console.log(data);
    if (isLoading) return <Loader />
    const {
        contents: {
            book,
            chapter,
            number,
            verse
        },
    } = data;
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <Typography variant="subtitle2" component="h1" align="center">
                    Verse of the Day
                </Typography>
                <Typography variant="subtitle2" component="h2" align="center">
                    {book} {chapter}:{number} - {verse}
                </Typography>
            </div>
        </div>
    );
}