import pymysql.cursors
from flask import (
    Flask,
    render_template,
    request,
    session,
    url_for,
    redirect,
    jsonify,
    abort,
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

# Constants for referencing
EMISSION_INTENSITY = 3.671 # metric tons per capita
ENERGY_INTENSITY = 3.4 # megajoules (MJ) per USD
WATER_EFFICIENCY = 50 # USD / cubic meter
WASTE_DIVERSE_RATE = 0.75 # percent recycled

# aborts if an unregistered user attempts to access a company specific page
def abort_if_not_company():
    # if guest, abort
    if ('username' not in session):
        abort(403, description="This page is not available for guest, please log in and try again")

    # check if current user is company
    cursor = conn.cursor()
    username = session['username']

    checkUser = "SELECT * FROM company WHERE company_username = %s"
    cursor.execute(checkUser, (username))
    checkResult = cursor.fetchall()
    cursor.close()
    # if check result shows None indicating current user is not company, abort
    if (not checkResult):
        abort(403, description="You don't have access to this page. Access only avaliable to company account")

# Helper function to calculation evaluation for each of the four categories
## if company_input = benchmark, the rating will be 50 (initital rating)
## for any input better than benchmark, points will be added on top of initial rating
## similarily, points will be removed if input is worse than benchmark
## if lower input is considered better, then negative should be set to True
def calculate_rating(company_input, benchmark, negative=False):
    initial = 50
    performance = company_input - benchmark
    if(negative):
        performance *= -1
    performance_ratio = performance / benchmark
    rating = initial + 50 * performance_ratio
    return rating

# Get inputs from the evaluation page 
# Evaluate the company with given inputs
# Store information into database
@app.route('/get_evaluated', methods=['GET', 'POST'])
def get_evaluated():
    # Check if user is logged in as company
    abort_if_not_company()
    
    company_username = session["username"]

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

    print(green_credits)

    # Update the company's green credit into database
    cursor = conn.cursor()
    query1 = ("UPDATE Company SET green_credits = %s WHERE company_username = %s")
    cursor.execute(query1, (green_credits, company_username))

    # Update Company_eval table
    query2 = "INSERT INTO Company_eval VALUES(%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(
        query2,
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

    conn.commit()
    cursor.close()
    return {"evaluate": True}

@app.route('/get_green_credit', methods=['GET'])
def get_green_credit():
    # Check if user is logged in as company
    abort_if_not_company()
    
    company_username = session["username"]
    
    cursor = conn.cursor()
    query = "SELECT company_name, green_credits FROM company WHERE company_username = %s"
    cursor.execute(query, (company_username))
    green_credit = cursor.fetchone()

    cursor.close()
    print(green_credit)

    if not green_credit:
        return jsonify({'message': 'No company found!'})

    return jsonify(green_credit)

if __name__ == '__main__':
    app.run(port=4242)