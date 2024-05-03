import React from 'react';
import renderer from 'react-test-renderer';
import { BrowserRouter as Router } from "react-router-dom";
import CompanyEvaluationForm from '../../components/CompanyEvaluationForm';

describe('CompanyEvaluationForm snapshot', () => {
  it('renders correctly', () => {
    const tree = renderer.create(<Router><CompanyEvaluationForm /></Router>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
