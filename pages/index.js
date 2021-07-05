import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import BibleVerse from '../components/BibleVerse';
import Copyright from '../components/Copyright';

export default function Index() {
  return (
    <Container maxWidth="sm">
      <BibleVerse />
      <Copyright />
    </Container>
  );
}