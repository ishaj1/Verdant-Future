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
import datetime
import random
import uuid
from datetime import datetime

app = Flask(__name__)
CORS(app)

app.secret_key = "secret_key"

conn = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    db="airline",
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
        query = ("") # find the company from the company table

    else:
        query = ("") # find the project from the project table

    cursor.execute(query, (username, str(hashlib.md5(password.encode()).digest())))
    
    data = cursor.fetchone()
    cursor.close()
    if data:
        session["user"] = True
        
        return {
            "user": True,
            "userName": data["fname"]
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
    contactname = request.form["contactname"]
    contactemail = request.form["contactemail"]
    description = request.form["description"]

    if isCompany == "true":
        #TODO: upload document
        pass


    cursor = conn.cursor()

    # TODO: queries
    # if isCompany:
    #     query = from the company table 
    # else:
    #     query = from the project table


    # stores the results in a variable
    data = cursor.fetchone()
    if data:
        # If the previous query returns data, then user exists
        return {
            "register": False
        }
    else:
        if isCompany == "true":
            # TODO insert into company table
            # ins = ()
            # cursor.execute(
            #     ins,
            #     (),
            # )
            pass

        else:
            # TODO insert into project table
            # ins = ()
            # cursor.execute(
            #     ins,
            #     (),
            # )
            pass
        
        conn.commit()
        cursor.close()
        return {"register": True}
