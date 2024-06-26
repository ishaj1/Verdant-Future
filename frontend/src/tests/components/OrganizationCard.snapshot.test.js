import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from 'react-router-dom';
import OrganizationCard from '../../components/OrganizationCard';

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      username: 'testUser',
      isProject: false,
    },
  }),
}));

it('OrganizationCard snapshot', () => {
  const organization = {
    id: 1,
    name: 'Test Organization',
    description: 'Test description',
    profile_link: '/organization/1',
  };

  const tree = renderer.create(<Router><OrganizationCard {...organization} /></Router>).toJSON();
  expect(tree).toMatchSnapshot();
});
