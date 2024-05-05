"""A test database have been set up and populated with test data prior to running these test cases""" 

import sys
import os
# Get the absolute path of the backend directory and add to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# print("Project_root: ", project_root)
sys.path.insert(0, project_root)
# print(sys.path)
import random
import string
import json
from payment import app

import pytest
from unittest.mock import patch

@pytest.fixture
def client(): 
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

@patch('payment.stripe.Charge.create')
@patch('payment.stripe.Transfer.create')
def test_project_transfer_funds(mock_transfer_create, mock_charge_create, client):
    # Mock the responses from stripe.Charge.create and stripe.Transfer.create
    transaction_name = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=10))
    charge_response = {'id': transaction_name, 'status': 'succeeded'}
    transfer_response = {'id': transaction_name, 'status': 'pending'}
    print(charge_response)
    print(transfer_response)

    mock_charge_create.return_value = charge_response
    mock_transfer_create.return_value = transfer_response

    data = {
        "amount": '100',
        "source": "companyA",
        "destination": "projectA"
    }
    response = client.post('/project_transfer', data=data)

    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert response_data['success'] == True
    assert 'message' in response_data
    assert response_data['message'] == 'Funds transferred successfully'

    # Assert that stripe.Charge.create and stripe.Transfer.create were called with the correct parameters
    mock_charge_create.assert_called_once_with(
        amount='100', # passed in as string
        currency='usd',
        source='acct_1P5t9bQSnkzLsREY' # for testing purpose
    )
    mock_transfer_create.assert_called_once_with(
        amount=95.0,  
        currency='usd',
        destination='acct_1P5t9bQSnkzLsREY' # for testing purpose
    )

def test_company_transfer_funds_create(client):
    data = {
        "amount": "100", # retrieved from database for testing purpose
        "source": "companyA",
        "destination": "companyB"
    }
    print("is this test running??")
    response = client.post('/company_transfer', data=data)

    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    print(response_data)
    assert response_data["create"] == True

@patch('payment.stripe.Charge.create')
@patch('payment.stripe.Transfer.create')
def test_company_transfer_response_accepted(mock_transfer_create, mock_charge_create, client):
    # Mock the responses from stripe.Charge.create and stripe.Transfer.create
    transaction_name = ''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=10))
    charge_response = {'id': transaction_name, 'status': 'succeeded'}
    transfer_response = {'id': transaction_name, 'status': 'pending'}

    mock_charge_create.return_value = charge_response
    mock_transfer_create.return_value = transfer_response

    # Call the function
    data = {
        "transaction_name": "HRIF1318J4", # retrieved from database for testing purpose
        "action": "accepted"
    }
    response = client.post('/company_response', data=data)

    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert response_data['success'] == True
    assert 'message' in response_data
    assert response_data['message'] == 'Funds transferred successfully'

    mock_charge_create.assert_called_once_with(
        amount='100', # passed in as string
        currency='usd',
        source='acct_1P5t9bQSnkzLsREY' # for testing purpose
    )
    mock_transfer_create.assert_called_once_with(
        amount='100',  
        currency='usd',
        destination='acct_1P5t9bQSnkzLsREY' # for testing purpose
    )

def test_company_transfer_response_declined(client):
    data = {
        "transaction_name": "JODC17EOVT", # change in database for testing purpose
        "action": "declined"
    }
    response = client.post('/company_response', data=data)

    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert response_data['success'] == True
    assert 'message' in response_data
    assert response_data['message'] == 'Transaction has been declined by the company'

def test_company_transfer_response_cancelled(client):
    data = {
        "transaction_name": "E1I8SVCUO3", # change in database for testing purpose
        "action": "cancelled"
    }
    response = client.post('/company_response', data=data)

    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert response_data['success'] == True
    assert 'message' in response_data
    assert response_data['message'] == 'Transaction has been cancelled by the company'

def test_get_past_transactions_no_transactions(client):
    response = client.get('/get_past_transactions?username=projectB')

    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert isinstance(response_data, list)
    assert response_data == []


def test_get_past_transactions_with_transactions(client):
    response = client.get('/get_past_transactions?username=companyA')
    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert isinstance(response_data, list)
    assert len(response_data) > 0


def test_get_past_transactions_missing_username(client):
    response = client.get('/get_past_transactions')
    # Assert on the response status code
    assert response.status_code == 400
    

def test_get_pending_transactions_no_pending_transactions(client):
    response = client.get('/get_pending_transactions?username=companyC')

    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert isinstance(response_data, list)
    assert response_data == []

def test_get_pending_transactions_with_pending_transactions(client):
    response = client.get('/get_pending_transactions?username=companyA')
    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert isinstance(response_data, list)
    assert len(response_data) > 0

def test_get_pending_transactions_missing_username(client):
    response = client.get('/get_past_transactions')
    # Assert on the response status code
    assert response.status_code == 400
