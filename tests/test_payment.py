import sys
import os
# Get the absolute path of the project root directory
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# Add the project root directory to the Python path
sys.path.insert(0, project_root)
# print(sys.path)
import random
import string
from backend.payment import app, conn

import pytest
from unittest.mock import patch, MagicMock
import json

@pytest.fixture
def client(): 
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# def test_register_new_company_user(client):
#     # Test registering a new user
#     response = client.post('/registerAuth', data={
#         'username': 'companyA',
#         'password': '123456',
#         'isCompany': 'true',
#         'name': 'Company A',
#         'contact_name': 'John Doe',
#         'contact_email': 'john@example.com',
#         'details': 'Company details',
#         'funds_required': 10000,
#         'funds_received': 0,
#         'payment_id': 'payment123'
#     })
#     data = json.loads(response.data)
#     assert data['register'] == True

# def test_register_new_project_user(client):
#     # Test registering a new user
#     response = client.post('/registerAuth', data={
#         'username': 'projectA',
#         'password': '234567',
#         'isCompany': 'false',
#         'project_association': 'NYU',
#         'name': 'Project A',
#         'contact_name': 'Alice',
#         'contact_email': 'alice@example.com',
#         'details': 'Company details',
#         'funds_required': 10000,
#         'funds_received': 0,
#         'payment_id': 'payment123'
#     })
#     data = json.loads(response.data)
#     assert data['register'] == True

# def test_register_new_company_user(client):
#     # Test registering a new user
#     response = client.post('/registerAuth', data={
#         'username': 'companyB',
#         'password': '123456',
#         'isCompany': 'true',
#         'name': 'Company B',
#         'contact_name': 'Doe John',
#         'contact_email': 'doe@example.com',
#         'details': 'Company details',
#         'funds_required': 10000,
#         'funds_received': 0,
#         'payment_id': 'payment456'
#     })
#     data = json.loads(response.data)
#     assert data['register'] == True

# def test_project_transfer_funds(client):
#     # Simulate a POST request to /project_transfer with appropriate data
#     data = {
#         "amount": "100",  # Example amount
#         "source": "companyA",  # Example sender username
#         "destination": "projectA"  # Example receiver username
#     }
#     response = client.post('/project_transfer', data=data)

#     # Assert on the response status code
#     assert response.status_code == 200

#     # Assert on the response data
#     response_data = json.loads(response.data)
#     assert response_data['success'] == True
#     assert 'details' in response_data
#     assert 'message' in response_data
#     assert response_data['message'] == 'Funds transferred successfully'

# @patch('backend.payment.stripe.Charge.create')
# @patch('backend.payment.stripe.Transfer.create')
# def test_project_transfer_funds(mock_transfer_create, mock_charge_create, client):
#     # Define custom response dictionaries for mock objects
#     charge_response = {'id': 'ch_123', 'status': 'succeeded'}
#     transfer_response = {'id': 'tr_123', 'status': 'pending'}

#     # Mock the responses from stripe.Charge.create and stripe.Transfer.create
#     mock_charge_create.return_value = charge_response
#     mock_transfer_create.return_value = transfer_response

#     # Simulate a POST request to /project_transfer with appropriate data
#     data = {
#         "amount": '100',
#         "source": "companyA",
#         "destination": "projectA"
#     }
#     response = client.post('/project_transfer', data=data)

#     # Assert on the response status code
#     assert response.status_code == 200

#     # Assert on the response data
#     response_data = response.json
#     assert response_data['success'] == True
#     assert 'message' in response_data
#     assert response_data['message'] == 'Funds transferred successfully'

#     # Assert that stripe.Charge.create and stripe.Transfer.create were called with the correct parameters
#     mock_charge_create.assert_called_once_with(
#         amount='100', # passed in as string
#         currency='usd',
#         source='acct_1P5t9bQSnkzLsREY' # for testing purpose
#     )
#     mock_transfer_create.assert_called_once_with(
#         amount=95.0,  
#         currency='usd',
#         destination='acct_1P5t9bQSnkzLsREY' # for testing purpose
#     )

# def test_company_transfer_funds(client):
#     print("test_company_transfer_funds/n")
#     # Call the function
#     data = {
#         "amount": "100", # retrieved from database for testing purpose
#         "source": "companyA",
#         "destination": "companyB"
#     }
#     print("is this test running??")
#     response = client.post('/company_transfer', data=data)

#     # Assert on the response status code
#     assert response.status_code == 200

#     # Assert on the response data
#     response_data = response.json
#     print(response_data)
#     assert response_data["create"] == True


# @patch('backend.payment.stripe.Charge.create')
# @patch('backend.payment.stripe.Transfer.create')
# def test_company_transfer_response_accepted(mock_transfer_create, mock_charge_create, client):
#     # Define custom response dictionaries for mock objects
#     charge_response = {'id': 'ch_123', 'status': 'succeeded'}
#     transfer_response = {'id': 'tr_123', 'status': 'pending'}

#     # Mock the responses from stripe.Charge.create and stripe.Transfer.create
#     mock_charge_create.return_value = charge_response
#     mock_transfer_create.return_value = transfer_response

#     # Call the function
#     data = {
#         "transaction_name": "RKA0QPZMUG", # retrieved from database for testing purpose
#         "action": "accepted"
#     }
#     response = client.post('/company_response', data=data)

#     # Assert on the response status code
#     assert response.status_code == 200

#     # Assert on the response data
#     response_data = response.json
#     assert response_data['success'] == True
#     assert 'message' in response_data
#     assert response_data['message'] == 'Funds transferred successfully'

#     # More assertions on other database updates...
#     mock_charge_create.assert_called_once_with(
#         amount='100', # passed in as string
#         currency='usd',
#         source='acct_1P5t9bQSnkzLsREY' # for testing purpose
#     )
#     mock_transfer_create.assert_called_once_with(
#         amount='100',  
#         currency='usd',
#         destination='acct_1P5t9bQSnkzLsREY' # for testing purpose
#     )

# def test_company_transfer_response_declined(client):
#     # Call the function
#     data = {
#         "transaction_name": "RKA0QPZMUG", # change in database for testing purpose
#         "action": "declined"
#     }
#     response = client.post('/company_response', data=data)

#     # Assert on the response status code
#     assert response.status_code == 200

#     # Assert on the response data
#     response_data = response.json
#     assert response_data['success'] == False
#     assert 'message' in response_data
#     assert response_data['message'] == 'Transaction has been declined by the company'

# def test_company_transfer_response_declined(client):
    # Call the function
    data = {
        "transaction_name": "RKA0QPZMUG", # change in database for testing purpose
        "action": "cancelled"
    }
    response = client.post('/company_response', data=data)

    # Assert on the response status code
    assert response.status_code == 200

    # Assert on the response data
    response_data = response.json
    assert response_data['success'] == False
    assert 'message' in response_data
    assert response_data['message'] == 'Transaction has been cancelled by the company'
