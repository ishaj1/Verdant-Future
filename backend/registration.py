import pymysql.cursors
from flask import (
    Flask,
    render_template,
    request,
    session,
    url_for,
    redirect,
    jsonify,
)
from flask_cors import CORS
import hashlib

app = Flask(__name__)
CORS(app)

app.secret_key = "secret_key"

conn = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    db="verdant_future",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)


# Members API route
@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]
    isCompany = request.form["isCustomer"]

    cursor = conn.cursor()

    if isCompany:
        query = ("SELECT company_username, company_password FROM Company WHERE"
                 "company_username = %s and company_password = %s")

    else:
        query = ("SELECT project_username, project_password FROM Project WHERE"
                 "project_username = %s and project_password = %s") 

    cursor.execute(query, (username, str(hashlib.md5(password.encode()).digest())))
    
    data = cursor.fetchone()
    cursor.close()
    if data:
        session["user"] = True
        
        return {
            "user": True,
            "userName": data["username"]
        }  
        
    else:
        return {
            "user": False,
            "userName": None
        }


# Authenticates the register
@app.route("/registerAuth", methods=["GET", "POST"])
def registerAuth():
    password = request.form["password"]
    isCompany = request.form["isCompany"]
    username = request.form["username"]
    if isCompany:
        company_name = request.form["companyname"]
    else:
        project_name = request.form["project_name"]
        project_association = request.form["project_association"]
    contact_name = request.form["contact_name"]
    contact_email = request.form["contact_email"]
    details = request.form["details"]
    funds_required = request.form["funds_required"]
    funds_received = request.form["funds_received"]
    payment_id = request.form["payment_id"]

    # if isCompany == "true":
        #TODO: certificate of existence？

    cursor = conn.cursor()

    if isCompany:
        query = (
            "SELECT company_username FROM Company WHERE company_username = %s"
        )
    else:
        query = (
            "SELECT project_username FROM project WHERE project_username = %s"
        )

    cursor.execute(query, (username))

    # stores the results in a variable
    data = cursor.fetchone()
    if data:
        # If the previous query returns data, then user exists
        return {
            "register": False
        }
    else:
        if isCompany == "true":
            ins = (
                "INSERT INTO Company VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s)"
            )
            cursor.execute(
                ins,
                (username,
                 str(hashlib.md5(password.encode()).digest()),
                 company_name,
                 contact_name,
                 contact_email,
                 details,
                 0,
                 funds_required,
                 funds_received,
                 payment_id
                 ),
            )

        else:
            ins = (
                "INSERT INTO Project VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"
            )
            cursor.execute(
                ins,
                (username,
                 str(hashlib.md5(password.encode()).digest()),
                 project_name,
                 project_association,
                 contact_name,
                 contact_email,
                 details,
                 funds_required,
                 funds_received,
                 payment_id
                 ),
            )
        
        conn.commit()
        cursor.close()
        return {"register": True}

@app.route('/display_company_profile', methods=['GET'])
def display_company_profiles():
    company_username = request.form["company_username"]
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM Company WHERE company_username =  %s', (company_username))
    record = cursor.fetchone()

    if not record:
        return jsonify({'message': 'No company found!'})

    record_dict = {
        'company_username': record[0],
        'company_password': record[1],
        'company_name': record[2],
        'contact_name': record[3],
        'contact_detail': record[4],
        'company_details': record[5],
        'green_credits': record[6],
        'funds_required': record[7],
        'funds_received': record[8],
        'payment_id': record[9]
    }

    conn.close()
    return jsonify({'company_records': record_dict})

@app.route('/display_project_profile', methods=['GET'])
def display_project_profiles():
    project_username = request.form["project_username"]
    cursor = conn.cursor()

    cursor.execute('SELECT * FROM Project WHERE project_username =  %s', (project_username))
    record = cursor.fetchone()

    if not record:
        return jsonify({'message': 'No project found!'})

    record_dict = {
        'project_username': record[0],
        'project_password': record[1],
        'project_name': record[2],
        'project_association': record[3],
        'contact_name': record[4],
        'contact_detail': record[5],
        'project_details': record[6],
        'funds_required': record[7],
        'funds_received': record[8],
        'payment_id': record[9]
    }

    conn.close()
    return jsonify({'project_records': record_dict})

@app.route("/view_companies", methods=['GET'])
def view_companies():
    cursor = conn.cursor()
    query = ("SELECT company_name, contact_name, contact_detail"
            +"company_details, funds_requires, funds_received FROM Company")
    
    cursor.execute(query)
    companies = cursor.fetchall()
    companies_lst = []
    for c in companies:
        company = {
            "company_name": c['company_name'],
            "contact_name": c['contact_name'],
            "contact_detail": c['contact_detail'],
            "company_details": c['company_details'],
            "funds_requires": c['funds_requires'],
            "funds_received": c['funds_received']
        }
        companies_lst.append(company)
   
    cursor.close()

    return jsonify(companies_lst)

@app.route("/view_projects", methods=['GET'])
def view_projects():
    cursor = conn.cursor()
    query = ("SELECT project_name, project_association, contact_name, contact_detail"
            +"project_details, funds_requires, funds_received FROM Project")
    
    cursor.execute(query)
    projects = cursor.fetchall()
    projects_lst = []
    for c in projects:
        project = {
            "company_name": c['company_name'],
            "contact_name": c['contact_name'],
            "contact_detail": c['contact_detail'],
            "company_details": c['company_details'],
            "funds_requires": c['funds_requires'],
            "funds_received": c['funds_received']
        }
        projects_lst.append(project)
   
    cursor.close()

    return jsonify(projects_lst)

if __name__ == '__main__':
    app.run(port=4242)