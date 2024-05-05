import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from "react-router-dom";
import LoginForm from '../../components/LoginForm';

test('LoginForm snapshot', () => {
  const tree = renderer.create(<Router><LoginForm /></Router>).toJSON();
  expect(tree).toMatchSnapshot();
});
