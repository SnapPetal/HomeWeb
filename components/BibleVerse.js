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
        <Typography variant="body2" color="textSecondary" align="center">
            <h2>Verse of the Day</h2>
            <p>{data.data.contents.verse}</p>
        </Typography>
    );
}