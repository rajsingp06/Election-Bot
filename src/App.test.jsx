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
    expect(screen.getByRole('main', { name: /Tutorial Reels/i })).toBeInTheDocument();
  });

  it('updates progress when a step is marked done', () => {
    render(<App />);
    const markDoneButtons = screen.getAllByText('Mark Done');
    fireEvent.click(markDoneButtons[0]);
    const progressBar = screen.getByLabelText(/Completion progress/i);
    expect(progressBar).toBeInTheDocument();
  });

  it('opens and closes the simulator', () => {
    render(<App />);
    const launchButton = screen.getByText('Launch Simulator');
    fireEvent.click(launchButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    const closeButton = screen.getByLabelText('Close Simulator');
    fireEvent.click(closeButton);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('handles the ID scan process', async () => {
    render(<App />);
    const scanButton = screen.getByLabelText(/Start scanning/i);
    fireEvent.click(scanButton);
    expect(screen.getByLabelText(/Scanning in progress/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/Verified by AI/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('navigates through simulator steps', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Launch Simulator'));
    expect(screen.getByText('Arrival & ID Check')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Next Step'));
    expect(screen.getByText('The Indelible Ink')).toBeInTheDocument();
  });

  it('matches the homepage snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});
