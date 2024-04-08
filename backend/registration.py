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

# Constants for evaluation referencing
EMISSION_INTENSITY = 3.671 # metric tons per capita
ENERGY_INTENSITY = 3.4 # megajoules (MJ) per USD
WATER_EFFICIENCY = 50 # USD / cubic meter
WASTE_DIVERSE_RATE = 0.75 # percent recycled

# Members API route
@app.route("/login", methods=["POST"])
def login():
    username = request.form["username"]
    password = request.form["password"]
    isCompany = request.form["isCompany"]

    cursor = conn.cursor()

    if isCompany == "true":
        query = ("SELECT company_username, company_password FROM Company WHERE company_username = %s and company_password = %s")

    else:
        query = ("SELECT project_username, project_password FROM Project WHERE project_username = %s and project_password = %s")

    cursor.execute(query, (username, str(hashlib.md5(password.encode()).digest())))
    
    data = cursor.fetchone()
    cursor.close()
    if data:
        session["user"] = True
        
        if isCompany == "true":
            return {
                "user": True,
                "userName": data["company_username"]
            }
        else:
            return {
                "user":True,
                "userName": data["project_username"]
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
    name = request.form['name'] #company or project name
    if isCompany == "false":
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
                "INSERT INTO Company VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            )
            cursor.execute(
                ins,
                (username,
                 str(hashlib.md5(password.encode()).digest()),
                 name,
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
                "INSERT INTO Project VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
            )
            cursor.execute(
                ins,
                (username,
                 str(hashlib.md5(password.encode()).digest()),
                 name,
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

@app.route('/display_profile', methods=['GET'])
def display_company_profiles():
    username = request.args["username"]
    isProject = request.args["isProject"]
    
    cursor = conn.cursor()
    
    if isProject == "true":
        cursor.execute('SELECT * FROM Project WHERE project_username =  %s', (username))
    else:
        cursor.execute('SELECT * FROM Company WHERE company_username =  %s', (username))
    
    record = cursor.fetchone()
    
    cursor.close()

    if not record:
        return jsonify({'message': 'No company found!'})
    
    record.pop("project_password" if isProject == "true" else "company_password")
    
    return jsonify({'records': record})



@app.route("/view_companies", methods=['GET'])
def view_companies():
    cursor = conn.cursor()
    query = ("SELECT company_username, company_name, contact_name, contact_detail, "
            +"company_details, funds_required, funds_received FROM Company")
    
    cursor.execute(query)
    companies = cursor.fetchall()
    companies_lst = []
    for c in companies:
        company = {
            "company_username": c['company_username'],
            "company_name": c['company_name'],
            "contact_name": c['contact_name'],
            "contact_detail": c['contact_detail'],
            "company_details": c['company_details'],
            "funds_required": c['funds_required'],
            "funds_received": c['funds_received']
        }
        companies_lst.append(company)
   
    cursor.close()

    return jsonify(companies)

@app.route("/view_projects", methods=['GET'])
def view_projects():
    cursor = conn.cursor()
    query = ("SELECT project_username, project_name, project_association, contact_name, contact_detail, "
            +"project_details, funds_required, funds_received FROM Project")
    
    cursor.execute(query)
    projects = cursor.fetchall()
    projects_lst = []
    for c in projects:
        project = {
            "project_username": c['project_username'],
            "project_name": c['project_name'],
            "contact_name": c['contact_name'],
            "contact_detail": c['contact_detail'],
            "project_details": c['project_details'],
            "funds_required": c['funds_required'],
            "funds_received": c['funds_received']
        }
        projects_lst.append(project)
   
    cursor.close()

    return jsonify(projects)

# Helper function to calculation evaluation for each of the four categories
def calculate_rating(company_input, benchmark, negative=False):
    initial = 50
    performance = company_input - benchmark
    if(negative):
        performance *= -1
    performance_ratio = performance / benchmark
    rating = initial + 50 * performance_ratio
    return rating

@app.route('/get_evaluated', methods=['GET', 'POST'])
def get_evaluated():    
    company_username = request.form["username"]
    
    cursor = conn.cursor()
    # get most recent evaluation data (is available)
    query1 = "SELECT green_credits FROM Company_eval WHERE company_username = %s ORDER BY entry_date DESC"
    cursor.execute(query1, (company_username))
    green_credit_data = cursor.fetchone()
    past_credits = 0
    if green_credit_data:
        past_credits = int(green_credit_data)
    
    # Grabs info from the form
    ## General info
    company_size = int(request.form["company_size"]) # number of employee
    revenue = int(request.form['revenue']) # in USD
    eval_date = request.form["date"]
    ## Greenhouse Gas Emission
    emission = int(request.form['emission']) # in metric ton
    ## Energy
    electricity = int(request.form['electricity']) # in kWh
    e_convert = 3.6 # conversion unit for electricity: 1 kWh = 3.6 MJ
    natural_gas = int(request.form['natural_gas']) # in cf 
    ng_convert = 1.055 # conversion unit for natural gas: 1 cf = 1.055 MJ
    ## Water
    water = int(request.form['water']) # in cubic meter
    ## Waste
    waste = int(request.form['waste']) # in kg
    recycled = int(request.form['recycled'])

    # Calculate rating for each categories
    ## Greenhouse Gas Emission
    ghg_ratio = round(emission / company_size, 3)
    ghg_rating = calculate_rating(ghg_ratio, EMISSION_INTENSITY, negative=True)
    ## Energy
    energy_rating = 0
    if(revenue > 0):
        energy = e_convert * electricity + ng_convert * natural_gas
        energy_ratio = round(energy / revenue, 3)
        energy_rating = calculate_rating(energy_ratio, ENERGY_INTENSITY, negative=True)
    ## Water
    water_rating = 0
    if(water > 0):
        water_ratio = round(revenue / water, 3)
        water_rating = calculate_rating(water_ratio, WATER_EFFICIENCY, negative=False)
        
    ## Waste
    waste_rating = 0
    if(waste > 0):
        waste_ratio = round(recycled / waste, 3)
        waste_rating = calculate_rating(waste_ratio, WASTE_DIVERSE_RATE, negative=False)
        
    # Final scoring (green credits) = GHG (35%) + Energy (30%) + Water (15%) + Waste (20%)
    # Green Company level: green credits >= 50
    final_rating = 0.35*ghg_rating + 0.3*energy_rating + 0.15*water_rating + 0.2*waste_rating
    green_credits = round(final_rating, 3)
    credits_diff = green_credits - past_credits

    # Store the company's evaluated green credit into database
    query = "INSERT INTO Company_eval VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(
        query,
        (
            company_username,
            eval_date,
            green_credits,
            company_size,
            revenue,
            emission,
            electricity,
            natural_gas,
            water,
            waste,
            recycled            
        ),
    )

    # Update the total credit in the Company table
    query2 = "UPDATE Company SET total_credits = total credits + %s WHERE username = %s"
    cursor.execute(
        query2,
        (
            credits_diff,
            company_username          
        ),
    )

    conn.commit()
    cursor.close()
    return {"evaluate": True}

@app.route('/get_green_credit', methods=['GET'])
def get_green_credit():
    company_username = request.args["username"]
    cursor = conn.cursor()
    query = "SELECT green_credits FROM Company_eval WHERE company_username = %s ORDER BY entry_date DESC"
    cursor.execute(query, (company_username))
    green_credit = cursor.fetchone()

    query1 = "SELECT total_credits FROM Company WHERE company_username = %s"
    cursor.execute(query1, (company_username))
    total_credit = cursor.fetchone()

    cursor.close()

    if not green_credit or not total_credit:
        return jsonify({'message': 'No company found!'})

    credits = {
        'green_credit': green_credit[0],
        'total_credit': total_credit[0]
    }

    return jsonify({'credits': credits})

@app.route('/update_password', methods=['GET', 'POST'])
def update_password():
    username = request.form["username"]
    isProject = request.form["isProject"]

    old_password = request.form["old_password"]
    new_password = request.form["new_password"]

    cursor = conn.cursor()

    if isProject == "true":
        query = ("SELECT company_username, company_password FROM Company WHERE company_username = %s and company_password = %s")

    else:
        query = ("SELECT project_username, project_password FROM Project WHERE project_username = %s and project_password = %s")

    cursor.execute(query, (username, str(hashlib.md5(old_password.encode()).digest())))
    data = cursor.fetchone()

    if data:
        
        if isProject == "true":
            query1 = ("UPDATE Project SET project_password = %s WHERE project_username = %s")
            cursor.execute(query1, (str(hashlib.md5(new_password.encode()).digest()), username))
                           
            return {
                "changePassword": True
            }
        else:
            query1 = ("UPDATE Company SET company_password = %s WHERE company_username = %s")
            cursor.execute(query1, (str(hashlib.md5(new_password.encode()).digest()), username))

            return {
                "changePassword": True
            }

    else:
        return {
            "changePassword": False
        }



@app.route('/update_profile', methods=['GET', 'POST'])
def update_profile():
    # Extract fields from the form data
    isProject = request.form["isProject"]
    username = request.form["username"]
    name = request.form["name"]
    if isProject == "true":
        project_association = request.form["association"]
    contact_name = request.form["contact_name"]
    contact_email = request.form["contact_email"]
    details = request.form["details"]
    funds_required = request.form["funds_required"]
    funds_received = request.form["funds_received"]
    payment_id = request.form["payment_id"]
    

    # Update the database based on the provided information
    cursor = conn.cursor()

    if isProject == "true":
        update_query = (
            " UPDATE Project SET project_name = %s, project_association = %s," 
            + "contact_name = %s, contact_detail = %s, project_details = %s, funds_required = %s, "
            + "funds_received = %s, payment_id = %s WHERE project_username = %s") 

        cursor.execute(update_query, (
            name,
            project_association,
            contact_name,
            contact_email,
            details,
            funds_required,
            funds_received,
            payment_id,
            username
        ))
    else: 
        update_query = (
            " UPDATE Company SET company_name = %s, contact_name = %s, "
            + "contact_detail = %s, company_details = %s, funds_required = %s, "
            + "funds_received = %s, payment_id = %s WHERE company_username = %s")
        cursor.execute(update_query, (
            name,
            contact_name,
            contact_email,
            details,
            funds_required,
            funds_received,
            payment_id,
            username
        ))

    conn.commit()
    cursor.close()

    return {"update": True}

if __name__ == '__main__':
    app.run(port=4242, debug=True, threaded=False)
