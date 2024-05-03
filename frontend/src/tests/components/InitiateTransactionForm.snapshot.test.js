import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from "react-router-dom";
import InitiateTransactionForm from "../../components/InitiateTransactionForm";

test('InitiateTransactionForm snapshot', () => {
  const tree = renderer
    .create(<Router><InitiateTransactionForm isTrade={true} uid="123" /></Router>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
