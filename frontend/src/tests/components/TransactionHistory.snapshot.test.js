import React from 'react';
import renderer from 'react-test-renderer';
import TransactionHistory from '../../components/TransactionHistory';

test('TransactionHistory snapshot', () => {
  const tree = renderer.create(<TransactionHistory />).toJSON();
  expect(tree).toMatchSnapshot();
});
