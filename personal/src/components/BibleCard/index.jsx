import React from "react";
import { Skeleton, Typography, CardContent, Card } from "@mui/material";
import { useQuery } from "@tanstack/react-query";

async function fetchBibleVerse() {
  const response = await fetch("https://bibleverse.thonbecker.com/");
  const verse = await response.json();
  return verse;
}

export default function index() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["bibleverse"],
    queryFn: fetchBibleVerse,
    staleTime: Infinity,
    cacheTime: 300000, // 5 minutes
    retry: 3,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <Skeleton variant="rectangular" width={400} height={200} />;
  }

  if (isError) {
    return (
      <span>
        Error:
        {error.message}
      </span>
    );
  }
  const { book, text, chapter, verse } = data;
  return (
    <Card variant="outlined" sx={{ width: 400, height: 200 }}>
      <CardContent>
        <Typography variant="h5" component="div" align="center" gutterBottom>
          Bible Verse of the Day
        </Typography>
        <Typography variant="subtitle1" align="center" gutterBottom>
          {`${book} ${chapter}:${verse} (King James Version)`}
        </Typography>
        <Typography variant="body2" align="left">
          {text.KJV}
        </Typography>
      </CardContent>
    </Card>
  );
}
