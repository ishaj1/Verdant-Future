import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from "react-router-dom";
import Header from '../../components/Header'; 
import AboutUs from '../../pages/AboutUs'; 

describe('AboutUs', () => {
  it('renders content correctly', () => {
    render(<Router><AboutUs /></Router>);
    const titleElement = screen.getByText("About Us");
    const descriptionElement = screen.getByText("Climate change is a global challenge", { exact: false });
    expect(titleElement).toBeInTheDocument();
    expect(descriptionElement).toBeInTheDocument();
  });
});
