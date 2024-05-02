import React from 'react';
import { render, waitFor, screen, fireEvent } from '@testing-library/react';
import TransactionHistory from '../../components/TransactionHistory';
import axios from '../../api/axios'; 
import useAuth from '../../hooks/useAuth';

jest.mock('../../api/axios');
jest.mock('../../hooks/useAuth');

describe('TransactionHistory', () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ auth: { username: 'testUser' } });
  });

  it('fetches transactions and renders them correctly', async () => {
    const mockTransactions = [
      { sender_username: 'user1', receiver_username: 'testUser', credits_transferred: 10, amount_transferred: 50 },
      { sender_username: 'user2', receiver_username: 'testUser', credits_transferred: 5, amount_transferred: 25 }
    ];
    axios.get.mockResolvedValueOnce({ data: mockTransactions });
  
    render(<TransactionHistory />);
  
    await waitFor(() => {
      expect(screen.getAllByText('To: testUser')).toHaveLength(2);
    });
  });

  it('renders "Transaction History" when no transactions are fetched', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    render(<TransactionHistory />);

    await waitFor(() => {
      expect(screen.getByText('Transaction History')).toBeInTheDocument();
    });
  });
});