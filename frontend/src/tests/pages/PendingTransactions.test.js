import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from "react-router-dom";
import PendingTransactions from '../../pages/PendingTransactions';
import axios from '../../api/axios';

jest.mock('../../api/axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));
jest.mock('../../hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    auth: {
      username: 'testUser',
      isProject: false,
    },
  }),
}));

describe('Pending Transactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders pending transactions correctly', async () => {
    const mockTransactions = [
      {
        sender_company_name: 'Sender Company 1',
        receiver_company_name: 'Receiver Company 1',
        credits_transferred: 100,
        amount_transferred: 5000,
        sender_username: 'testUser',
        transaction_name: 'transaction1',
      },
      {
        sender_company_name: 'Sender Company 2',
        receiver_company_name: 'Receiver Company 2',
        credits_transferred: 200,
        amount_transferred: 10000,
        sender_username: 'testUser',
        transaction_name: 'transaction2',
      },
    ];

    axios.get.mockResolvedValueOnce({ data: mockTransactions });

    render(<MemoryRouter><PendingTransactions /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText('Pending Trade Requests')).toBeInTheDocument();
      mockTransactions.forEach(transaction => {
        expect(screen.getByText(`${transaction.sender_company_name}`)).toBeInTheDocument();
        expect(screen.getByText(`${transaction.receiver_company_name}`)).toBeInTheDocument();
        expect(screen.getByText(`${transaction.credits_transferred}`)).toBeInTheDocument();
        expect(screen.getByText(`$${(transaction.amount_transferred / 100).toFixed(2)}`)).toBeInTheDocument();
      });
    });
  });

  it('responds to transaction cancellation', async () => {
    const mockTransaction = {
      sender_company_name: 'Sender Company 1',
      receiver_company_name: 'Receiver Company 1',
      credits_transferred: 100,
      amount_transferred: 5000,
      sender_username: 'testUser',
      transaction_name: 'transaction1',
    };

    axios.get.mockResolvedValueOnce({ data: [mockTransaction] });
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<MemoryRouter><PendingTransactions /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(`${mockTransaction.sender_company_name}`)).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/company_response', { transaction_name: mockTransaction.transaction_name, action: 'cancelled' }, {"headers": {"Content-Type": "application/x-www-form-urlencoded"}});
      expect(screen.queryByText('Sorry, your offer could not be cancelled. The offer may have already been accepted or declined. Please try again later.')).not.toBeInTheDocument();
    });
  });

  it('displays error message if transaction cancellation fails', async () => {
    const mockTransaction = {
      sender_company_name: 'Sender Company 1',
      receiver_company_name: 'Receiver Company 1',
      credits_transferred: 100,
      amount_transferred: 5000,
      sender_username: 'testUser',
      transaction_name: 'transaction1',
    };

    axios.get.mockResolvedValueOnce({ data: [mockTransaction] });
    axios.post.mockResolvedValueOnce({ data: { success: false } });
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<MemoryRouter><PendingTransactions /></MemoryRouter>);

    await waitFor(() => {
      expect(screen.getByText(`${mockTransaction.sender_company_name}`)).toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/company_response', { transaction_name: mockTransaction.transaction_name, action: 'cancelled' }, {"headers": {"Content-Type": "application/x-www-form-urlencoded"}});
      expect(screen.getByText('Sorry, your offer could not be cancelled. The offer may have already been accepted or declined. Please try again later.')).toBeInTheDocument();
    });
  });
});
