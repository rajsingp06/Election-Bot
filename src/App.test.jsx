import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

describe('App Components', () => {
  it('renders the Navbar correctly', () => {
    render(<App />);
    expect(screen.getByText('ElectionBot')).toBeInTheDocument();
    expect(screen.getByText('Guide')).toBeInTheDocument();
    expect(screen.getAllByText(/Checklist/i)[0]).toBeInTheDocument();
    expect(screen.getByText('Tutorials')).toBeInTheDocument();
  });

  it('renders the GuidePage by default', () => {
    render(<App />);
    expect(screen.getByText('Understand your vote.')).toBeInTheDocument();
    expect(screen.getByText('The Process.')).toBeInTheDocument();
  });

  it('navigates to ChecklistPage', () => {
    render(<App />);
    const checklistLink = screen.getAllByText('Checklist').find(el => el.tagName === 'A' || el.tagName === 'BUTTON');
    if (checklistLink) {
      fireEvent.click(checklistLink);
      expect(screen.getByText('What to Carry.')).toBeInTheDocument();
    }
  });

  it('navigates to Reels Page', () => {
    render(<App />);
    const tutorialsLink = screen.getByText('Tutorials');
    fireEvent.click(tutorialsLink);
    // Since ReelsPage uses a header with Tutorials text
    expect(screen.getByRole('main', { name: /Tutorial Reels/i })).toBeInTheDocument();
  });

  it('navigates to Login Page', () => {
    render(<App />);
    const loginLink = screen.getByText('Login');
    fireEvent.click(loginLink);
    expect(screen.getByText('Welcome back.')).toBeInTheDocument();
  });

  it('renders the Voice Assistant buttons', () => {
    render(<App />);
    const listenButtons = screen.getAllByLabelText('Read text aloud');
    expect(listenButtons.length).toBeGreaterThan(0);
  });
});
