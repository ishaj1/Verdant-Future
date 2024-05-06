import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import TransactionHistory from '../../pages/TransactionHistory';
import axios from '../../api/axios';

jest.mock('../../api/axios');
jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
    default: () => ({
      auth: {
        username: 'testUser',
        isProject: false,
      },
    }),
  }));
jest.mock("../../icons/green_credits.png", () => ({}));


describe('TransactionHistory component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header and transaction history correctly', async () => {
    const mockTransactions = [
      {
        sender_company_name: 'Company A',
        receiver_company_name: 'Company B',
        credits_transferred: 100,
        amount_transferred: 50000,
      },
      {
        sender_company_name: 'Company C',
        receiver_project_name: 'Project X',
        credits_transferred: 200,
        amount_transferred: 100000,
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTransactions });

    const { getByText } = render(<MemoryRouter><TransactionHistory /></MemoryRouter>);

    expect(getByText('Transaction History')).toBeInTheDocument();

    await waitFor(() => {
      expect(getByText('Company A')).toBeInTheDocument();
      expect(getByText('Company B')).toBeInTheDocument();
      expect(getByText('100')).toBeInTheDocument();
      expect(getByText('$500.00')).toBeInTheDocument();
      expect(getByText('Company C')).toBeInTheDocument();
      expect(getByText('Project X')).toBeInTheDocument();
      expect(getByText('200')).toBeInTheDocument();
      expect(getByText('$1000.00')).toBeInTheDocument();
    });
  });

  it('fetches transactions on mount', async () => {
    const mockTransactions = [
        {
          sender_company_name: 'Company A',
          receiver_company_name: 'Company B',
          credits_transferred: 100,
          amount_transferred: 50000,
        },
        {
          sender_company_name: 'Company C',
          receiver_project_name: 'Project X',
          credits_transferred: 200,
          amount_transferred: 100000,
        },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTransactions });

    render(<MemoryRouter><TransactionHistory /></MemoryRouter>);

    expect(axios.get).toHaveBeenCalledWith('/get_past_transactions', {
      params: { username: 'testUser' },
    });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
    });
  });
});
