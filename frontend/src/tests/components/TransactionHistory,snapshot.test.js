import React from 'react';
import renderer from 'react-test-renderer';
import TransactionHistory from '../../components/TransactionHistory';

test('renders TransactionHistory correctly', () => {
  const tree = renderer.create(<TransactionHistory />).toJSON();
  expect(tree).toMatchSnapshot();
});
