"""A test database have been set up and populated with test data prior to running these test cases""" 

import sys
import os
# Get the absolute path of the project root directory
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# Add the project root directory to the Python path
sys.path.insert(0, project_root)
# print(sys.path)
from backend.registration import app, conn

import pytest
import json

@pytest.fixture
def client(): 
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_register_new_company_user(client):
    # Test registering a new user
    response = client.post('/registerAuth', data={
        'username': 'companyA',
        'password': '123456',
        'isCompany': 'true',
        'name': 'Company A',
        'contact_name': 'John Doe',
        'contact_email': 'john@example.com',
        'details': 'Company details',
        'funds_required': 10000,
        'funds_received': 0
    })
    data = json.loads(response.data)
    assert data['register'] == True

def test_register_new_project_user(client):
    # Test registering a new user
    response = client.post('/registerAuth', data={
        'username': 'projectA',
        'password': '234567',
        'isCompany': 'false',
        'project_association': 'NYU',
        'name': 'Project A',
        'contact_name': 'Alice',
        'contact_email': 'alice@example.com',
        'details': 'Company details',
        'funds_required': 10000,
        'funds_received': 0
    })
    data = json.loads(response.data)
    assert data['register'] == True

def test_register_existing_user(client):
    # Test attempting to register an existing user
    response = client.post('/registerAuth', data={
        'username': 'projectA',
        'password': '234567',
        'isCompany': 'false',
        'project_association': 'NYU',
        'name': 'Project A',
        'contact_name': 'John Doe',
        'contact_email': 'john@example.com',
        'details': 'Company details',
        'funds_required': 10000,
        'funds_received': 0,
        'payment_id': 'payment1234'
    })
    data = json.loads(response.data)
    assert data['register'] == False

def test_login_company(client):
    # Test login for a company
    response = client.post('/login', data={'username': 'companyA', 'password': '123456', 'isCompany': 'true'})
    data = json.loads(response.data)
    assert data['user'] == True
    assert data['userName'] == 'companyA'

def test_login_project(client):
    # Test login for a project
    response = client.post('/login', data={'username': 'projectA', 'password': '234567', 'isCompany': 'false'})
    data = json.loads(response.data)
    assert data['user'] == True
    assert data['userName'] == 'projectA'

def test_invalid_login(client):
    # Test login with invalid credentials
    response = client.post('/login', data={'username': 'invalid_username', 'password': 'invalid_password', 'isCompany': 'true'})
    data = json.loads(response.data)
    assert data['user'] == False
    assert data['userName'] == None

def test_display_project_profile(client):
    # Test displaying a project profile
    response = client.get('/display_profile', data={
        'username': 'projectA',
        'isProject': 'true'
    })
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'records' in data
    assert 'project_password' not in data['records']  # Ensure password is not included

def test_display_company_profile(client):
    # Test displaying a company profile
    response = client.get('/display_profile', data={
        'username': 'companyA',
        'isProject': 'false'
    })
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'records' in data
    assert 'company_password' not in data['records']  # Ensure password is not included

def test_nonexistent_profile(client):
    # Test displaying a profile that doesn't exist
    response = client.get('/display_profile', data={
        'username': 'nonexistent_user',
        'isProject': 'true'
    })
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'message' in data
    assert data['message'] == 'No company found!'

def test_view_companies(client):
    # Test viewing companies
    response = client.get('/view_companies')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) > 0
    assert all('company_username' in company for company in data)
    assert all('company_name' in company for company in data)
    assert all('contact_name' in company for company in data)
    assert all('contact_detail' in company for company in data)
    assert all('company_details' in company for company in data)
    assert all('funds_required' in company for company in data)
    assert all('funds_received' in company for company in data)

def test_view_projects(client):
    # Test viewing projects
    response = client.get('/view_projects')
    data = json.loads(response.data)
    assert response.status_code == 200
    assert isinstance(data, list)
    assert len(data) > 0
    assert all('project_username' in project for project in data)
    assert all('project_name' in project for project in data)
    assert all('contact_name' in project for project in data)
    assert all('contact_detail' in project for project in data)
    assert all('project_details' in project for project in data)
    assert all('funds_required' in project for project in data)
    assert all('funds_received' in project for project in data)

def test_get_evaluated_first_time(client):
    # Simulate form data
    data = {
        "username": "companyA",
        "company_size": 100,
        "revenue": 100000,
        "date": "2024-04-21",
        "emission": 500,
        "electricity": 2000,
        "natural_gas": 3000,
        "water": 5000,
        "waste": 1000,
        "recycled": 800
    }

    # Send POST request with form data
    response = client.post('/get_evaluated', data=data)

    # Verify response
    response_data = json.loads(response.data)
    assert response.status_code == 200
    assert response_data['evaluate'] == True

    # Check if green_credits are updated correctly
    cursor = conn.cursor()
    cursor.execute("SELECT green_credits FROM Company_eval WHERE company_username = 'companyA' ORDER BY entry_date DESC LIMIT 1")
    updated_green_credits = cursor.fetchone()['green_credits']
    cursor.execute("SELECT total_credits FROM Company WHERE company_username = 'companyA'")
    updated_total_credits = cursor.fetchone()['total_credits']
    cursor.close()

    assert updated_green_credits == 54.372
    assert updated_total_credits == 54.372

def test_get_evaluated_after_first_time(client):
    # Simulate Company A invests in projects/companies and its green credit is now 60
    # In the most recent evaluation, the result was 54.372
    cursor = conn.cursor()
    cursor.execute("UPDATE Company SET total_credits = 60")
    cursor.close()

    # Simulate form data
    data = {
        "username": "companyA",
        "company_size": 100,
        "revenue": 90000,
        "date": "2024-04-22",
        "emission": 400,
        "electricity": 2000,
        "natural_gas": 3000,
        "water": 5000,
        "waste": 1000,
        "recycled": 800
    }

    # Send POST request with form data
    response = client.post('/get_evaluated', data=data)

    # Verify response
    response_data = json.loads(response.data)
    assert response.status_code == 200
    assert response_data['evaluate'] == True

    # Check if green_credits are updated correctly
    cursor = conn.cursor()
    cursor.execute("SELECT green_credits FROM Company_eval WHERE company_username = 'companyA' ORDER BY entry_date DESC LIMIT 1")
    updated_green_credits = cursor.fetchone()['green_credits']

    cursor.execute("SELECT total_credits FROM Company WHERE company_username = 'companyA'")
    updated_total_credits = cursor.fetchone()['total_credits']
    cursor.close()

    assert updated_total_credits == 64.419
    assert updated_green_credits == 58.791

def test_get_green_credit_existing_company(client):
    # Simulate request for an existing company
    response = client.get('/get_green_credit?username=companyA')

    # Verify response
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'credits' in data
    assert 'green_credit' in data['credits']
    assert 'total_credit' in data['credits']

def test_get_green_credit_nonexistent_company(client):
    # Simulate request for a nonexistent company
    response = client.get('/get_green_credit?username=nonexistent_company')

    # Verify response
    data = json.loads(response.data)
    assert response.status_code == 200
    assert 'message' in data
    assert data['message'] == 'No company found!'

def test_update_password_success(client):
    # Simulate request with correct credentials
    response = client.post('/update_password', data={'username': 'companyA', 'isProject': 'false', 'old_password': '123456', 'new_password': 'new_password'})
    
    # Verify response
    assert response.status_code == 200
    data = response.get_json()
    assert 'changePassword' in data
    assert data['changePassword'] == True

def test_update_password_wrong_credentials(client):
    # Simulate request with incorrect old password
    response = client.post('/update_password', data={'username': 'companyA', 'isProject': 'false', 'old_password': 'wrong_password', 'new_password': 'new_password'})
    
    # Verify response
    assert response.status_code == 200
    data = response.get_json()
    assert 'changePassword' in data
    assert data['changePassword'] == False

def test_update_password_missing_data(client):
    # Simulate request with missing data
    response = client.post('/update_password', data={'username': 'companyA', 'isProject': 'false', 'new_password': 'new_password'})
    
    # Verify response status code
    assert response.status_code == 400
    
    # Check if response contains JSON data
    data = response.get_json()
    if data is None:
        assert True
    else:
        assert 'changePassword' in data
        assert data['changePassword'] == False

def test_update_profile_project(client):
    # Simulate request to update project profile
    response = client.post('/update_profile', data={
        'isProject': 'true',
        'username': 'projectA',
        'name': 'New Project Name',
        'association': 'New Association',
        'contact_name': 'New Contact Name',
        'contact_email': 'newemail@example.com',
        'details': 'New project details',
        'funds_required': '10000',
        'funds_received': '5000',
        'payment_id': 'new_payment_id'
    })

    # Verify response
    assert response.status_code == 200
    data = response.get_json()
    assert 'update' in data
    assert data['update'] == True

def test_update_profile_company(client):
    # Simulate request to update company profile
    response = client.post('/update_profile', data={
        'isProject': 'false',
        'username': 'companyA',
        'name': 'New Company Name',
        'contact_name': 'New Contact Name',
        'contact_email': 'newemail@example.com',
        'details': 'New company details',
        'funds_required': '20000',
        'funds_received': '10000',
        'payment_id': 'new_payment_id'
    })

    # Verify response
    assert response.status_code == 200
    data = response.get_json()
    assert 'update' in data
    assert data['update'] == True