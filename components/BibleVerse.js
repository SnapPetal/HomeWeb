import React from 'react';
import axios from 'axios';
import { useQuery } from "react-query";
import Typography from '@material-ui/core/Typography';

const fetchBibleVerse = async () => {
    return await axios.get('https://quotes.rest/bible/vod.json');
};

export default function BibleVerse() {
    const { isLoading, isError, data, error } = useQuery("verse", fetchBibleVerse);
    if (!data) return null;
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            <h2>Verse of the Day</h2>
            <p>{data.data.contents.verse}</p>
        </Typography>
    );
}