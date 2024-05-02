import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from "react-router-dom";
import UpdateProfileForm from "../../components/UpdateProfileForm";

jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      username: 'testUser',
      isProject: true, 
    },
  }),
}));

describe('UpdateProfileForm', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(<Router><UpdateProfileForm /></Router>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
