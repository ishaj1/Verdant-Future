import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import OrganizationCard from '../../components/OrganizationCard';

describe('OrganizationCard component', () => {
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

  it('links to the organization profile page', () => {
    const organization = {
      id: 1,
      name: 'Test Organization',
      description: 'Test description',
      profile_link: '/organization/1',
    };

    render(
      <Router>
        <OrganizationCard {...organization} />
      </Router>
    );

    // Find the link element and assert its content and href attribute
    const link = screen.getByRole('link', { name: 'Test Organization Test description' });
    expect(link).toHaveAttribute('href', '/organization/1');
  });
});
