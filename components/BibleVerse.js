import React from 'react';
import axios from 'axios';
import { useQuery } from "react-query";
import Typography from '@material-ui/core/Typography';

const fetchBibleVerse = async () => {
    return await axios.get('https://www.ourmanna.com/verses/api/get?format=json&order=random', {
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    });
};

export default function BibleVerse() {
    const { data, status } = useQuery("verse", fetchBibleVerse);
    if (!data) return null;
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            <h2>Verse of the Day</h2>
            <p>{data.verse.details.text}</p>
            <p>{data.verse.details.reference} {data.verse.details.version}</p>
        </Typography>
    );
}