import React from 'react';
import axios from 'axios';
import { useQuery } from "react-query";
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Loader from './Loader';

const fetchBibleVerse = async () => {
    return await axios.get('https://quotes.rest/bible/vod.json');
};

export default function BibleVerse() {
    const { data } = useQuery("verse", fetchBibleVerse);
    if (!data) return <Loader />
    return (
        <React.Fragment>
            <Typography variant="subtitle2" component="h1" align="center">
                Verse of the Day
            </Typography>
            <Typography variant="subtitle2" component="h2" align="center">
                {data.data.contents.verse}
            </Typography>
        </React.Fragment>
    );
}