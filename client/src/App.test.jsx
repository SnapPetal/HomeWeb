import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'
import App from './App';

test('renders learn react link', () => {
  render(<App />, { wrapper: MemoryRouter });
  const titleElement = screen.getAllByText('About');
  expect(titleElement).toHaveLength(2);
});
