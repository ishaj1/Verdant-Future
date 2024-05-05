import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from "react-router-dom";
import Header from '../../components/Header'; 
import AboutUs from '../../pages/AboutUs'; 

test('renders AboutUs page correctly', () => {
  const tree = renderer.create(<Router><AboutUs /></Router>).toJSON();

  // Assert the snapshot
  expect(tree).toMatchSnapshot();
});
