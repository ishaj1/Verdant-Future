import React from 'react';
import renderer from 'react-test-renderer';
import PendingTransactions from '../../components/PendingTransactions';

it('matches the snapshot', () => {
  const tree = renderer.create(<PendingTransactions numTransactionResponses={0} setNumTransactionResponses={() => {}} />).toJSON();
  expect(tree).toMatchSnapshot();
});
