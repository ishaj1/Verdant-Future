import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from '../../api/axios';
import PendingTransactions from '../../components/PendingTransactions';

jest.mock('../../api/axios');
jest.mock('../../hooks/useAuth', () => ({
    __esModule: true,
    default: () => ({
      auth: {
        username: 'testUser',
      },
    }),
}));

describe('PendingTransactions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches transactions and renders them correctly', async () => {
    const mockTransactions = [
      { sender_username: 'user1', receiver_username: 'testUser', credits_transferred: 10, amount_transferred: 50 },
      { sender_username: 'user2', receiver_username: 'testUser', credits_transferred: 5, amount_transferred: 25 }
    ];
    axios.get.mockResolvedValueOnce({ data: mockTransactions });

    const { getAllByText } = render(<PendingTransactions numTransactionResponses={0} setNumTransactionResponses={() => {}} />);

    await waitFor(() => {
        expect(getAllByText('To: testUser')).toHaveLength(2);
    });
  });

  test('cancel transaction', async () => {
    const mockTransactions = [{ transaction_name: 'transactionName', sender_username: 'testUser', receiver_username: 'user1', credits_transferred: 10, amount_transferred: 50 }];
    axios.get.mockResolvedValue({ data: mockTransactions });
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    const header = {
        "headers": { "Content-Type": "application/x-www-form-urlencoded" },
    }

    const { getByText } = render(<PendingTransactions numTransactionResponses={0} setNumTransactionResponses={() => {}} />);
    await waitFor(() => {
        expect(getByText('Cancel')).toBeInTheDocument();
    });
    
    fireEvent.click(getByText('Cancel'));
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/company_response', { transaction_name: 'transactionName', action: 'cancelled' }, header);
    });
  });

  test('cancel transaction unsuccessful', async () => {
    const mockTransactions = [{ transaction_name: 'transactionName', sender_username: 'testUser', receiver_username: 'user1', credits_transferred: 10, amount_transferred: 50 }];
    axios.get.mockResolvedValue({ data: mockTransactions });
    axios.post.mockResolvedValueOnce({ data: { success: false } });
    const header = {
        "headers": { "Content-Type": "application/x-www-form-urlencoded" },
    }

    const { getByText } = render(<PendingTransactions numTransactionResponses={0} setNumTransactionResponses={() => {}} />);
    await waitFor(() => {
        expect(getByText('Cancel')).toBeInTheDocument();
    });
    
    fireEvent.click(getByText('Cancel'));
    await waitFor(() => {
        expect(getByText("Sorry, your offer could not be cancelled. The offer may have already been accepted or declined. Please try again later.")).toBeInTheDocument();
    });
  });

  test('accept transaction', async () => {
    const mockTransactions = [
        { transaction_name: 'transaction1', sender_username: 'user1', receiver_username: 'testUser', credits_transferred: 10, amount_transferred: 50 },
    ];
    axios.get.mockResolvedValue({ data: mockTransactions });
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    const header = {
        "headers": { "Content-Type": "application/x-www-form-urlencoded" },
    }

    const { getByText } = render(<PendingTransactions numTransactionResponses={0} setNumTransactionResponses={() => {}} />);
    await waitFor(() => {
        expect(getByText('Accept')).toBeInTheDocument();
    });
    
    fireEvent.click(getByText('Accept'));
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/company_response', { transaction_name: 'transaction1', action: 'accepted' }, header);
    });
  });

  test('accept transaction unsuccessful', async () => {
    const mockTransactions = [
        { transaction_name: 'transaction1', sender_username: 'user1', receiver_username: 'testUser', credits_transferred: 10, amount_transferred: 50 },
    ];
    axios.get.mockResolvedValue({ data: mockTransactions });
    axios.post.mockResolvedValueOnce({ data: { success: false } });
    const header = {
        "headers": { "Content-Type": "application/x-www-form-urlencoded" },
    }

    const { getByText } = render(<PendingTransactions numTransactionResponses={0} setNumTransactionResponses={() => {}} />);
    await waitFor(() => {
        expect(getByText('Accept')).toBeInTheDocument();
    });
    
    fireEvent.click(getByText('Accept'));
    await waitFor(() => {
        expect(getByText("Sorry, your request could not be processed. The offer may have already been canceled. Please try again later.")).toBeInTheDocument();
    });
  });

  test('decline transaction', async () => {
    const mockTransactions = [
        { transaction_name: 'transaction1', sender_username: 'user1', receiver_username: 'testUser', credits_transferred: 10, amount_transferred: 50 },
    ];
    axios.get.mockResolvedValue({ data: mockTransactions });
    axios.post.mockResolvedValueOnce({ data: { success: true } });
    const header = {
        "headers": { "Content-Type": "application/x-www-form-urlencoded" },
    }

    const { getByText } = render(<PendingTransactions numTransactionResponses={0} setNumTransactionResponses={() => {}} />);
    await waitFor(() => {
        expect(getByText('Decline')).toBeInTheDocument();
    });
    
    fireEvent.click(getByText('Decline'));
    await waitFor(() => {
        expect(axios.post).toHaveBeenCalledWith('/company_response', { transaction_name: 'transaction1', action: 'declined' }, header);
    });
  });

  test('decline transaction unsuccessful', async () => {
    const mockTransactions = [
        { transaction_name: 'transaction1', sender_username: 'user1', receiver_username: 'testUser', credits_transferred: 10, amount_transferred: 50 },
    ];
    axios.get.mockResolvedValue({ data: mockTransactions });
    axios.post.mockResolvedValueOnce({ data: { success: false } });
    const header = {
        "headers": { "Content-Type": "application/x-www-form-urlencoded" },
    }

    const { getByText } = render(<PendingTransactions numTransactionResponses={0} setNumTransactionResponses={() => {}} />);
    await waitFor(() => {
        expect(getByText('Decline')).toBeInTheDocument();
    });
    
    fireEvent.click(getByText('Decline'));
    await waitFor(() => {
        expect(getByText("Sorry, your request could not be processed. The offer may have already been canceled. Please try again later.")).toBeInTheDocument();
    });
  });
});
