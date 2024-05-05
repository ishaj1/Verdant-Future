import React from 'react';
import renderer from 'react-test-renderer';
import UpdatePasswordForm from '../../components/UpdatePasswordForm';

test('UpdatePasswordForm snapshot', () => {
  const tree = renderer.create(<UpdatePasswordForm />).toJSON();
  expect(tree).toMatchSnapshot();
});
