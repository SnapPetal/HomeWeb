import React from "react";
import { Typography, CardContent, Card } from "@mui/material";

export default function index({ book, text, chapter, verse }) {
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
