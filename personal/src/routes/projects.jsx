import React from "react";
import { useLoaderData } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export async function loader() {
  const dadJokeResponse = await fetch("https://icanhazdadjoke.com", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "User-Agent": "thonbecker.com",
    },
  });
  const { joke } = await dadJokeResponse.json();
  const jokeResponse = await fetch(
    "https://ondxpdql18.execute-api.us-east-1.amazonaws.com/joke",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(joke),
    },
  );
  return await jokeResponse.json();
}

export default function Projects() {
  const { key } = useLoaderData();

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" gutterBottom>
          Projects
        </Typography>
        <Typography variant="h4" component="h2" gutterBottom>
          Dad Joke of the Day
        </Typography>
        <Typography variant="body1" gutterBottom>
          The project utilizes Amazon Polly, an AWS service, to transform a
          daily dad joke into an engaging audio experience. Implemented in
          NodeJS, the script interacts with the Polly API, allowing for seamless
          text-to-speech conversion. A predefined dad joke serves as the input
          text, triggering the Polly service to generate lifelike speech. The
          synthesized audio is then saved as an OGG file in a S3 bucket,
          providing an amusing and dynamically spoken rendition of the chosen
          dad joke. This simple yet entertaining application showcases the
          capabilities of AWS Polly in converting text content into
          natural-sounding speech, adding a delightful auditory dimension to the
          humor of the day.
        </Typography>
        <audio controls>
          <source src={`https://cdn.thonbecker.com/${key}`} type="audio/ogg" />
          Your browser does not support the audio element.
        </audio>
      </Container>
    </Box>
  );
}
