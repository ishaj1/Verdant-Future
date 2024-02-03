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
    isCompany = request.form["isCustomer"]
    username = request.form["username"]
    if isCompany:
        company_name = request.form["companyname"]
    else:
        project_name = request.form["project_name"]
        project_association = request.form["project_association"]
    contact_name = request.form["contactname"]
    contact_email = request.form["contactemail"]
    details = request.form["details"]
    funds_required = request.form["funds_required"]

    # if isCompany == "true":
        #TODO: certificate of existence？

    cursor = conn.cursor()

    # TODO: queries
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
                "INSERT INTO Company VALUES(%s, %s, %s, %s, %s, %s, %s, %s)"
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
                 funds_required
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
                 funds_required
                 ),
            )
        
        conn.commit()
        cursor.close()
        return {"register": True}