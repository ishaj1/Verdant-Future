import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('OrganizationCard', () => {
  const organization = {
    description: 'Test description',
    id: 1,
    profile_link: '/profile/1',
    name: 'Test Organization',
  };

  it('renders organization name and description', () => {
    render(
      <Router>
        <OrganizationCard {...organization} />
      </Router>
    );

    const organizationName = screen.getByText('Test Organization');
    const organizationDescription = screen.getByText('Test description');

    expect(organizationName).toBeInTheDocument();
    expect(organizationDescription).toBeInTheDocument();
  });
});
