# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
# import stripe
# stripe.api_key = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"

# stripe.Account.create(type="express")

# stripe.AccountLink.create(
#   account='acct_1OhG9CIpT4QrzBMJ',
#   refresh_url="https://example.com/reauth",
#   return_url="https://example.com/return",
#   type="account_onboarding",
# )

# stripe.checkout.Session.create(
#   mode="payment",
#   line_items=[{"price": '{{PRICE_ID}}', "quantity": 1}],
#   payment_intent_data={
#     "application_fee_amount": 123,
#     "transfer_data": {"destination": '{{CONNECTED_ACCOUNT_ID}}'},
#   },
#   success_url="https://example.com/success",
#   cancel_url="https://example.com/cancel",
# )


# import stripe
# stripe.api_key = "sk_test_51Oe5AZKlgwtgt0eBACDFWMTEWAP1XzGbXa4MhgJRUaPIxza3JMJqcaNj4E2820ioJgPLJZiEQyAr3Y7CODV8Hxsm00BxyqGbKO"
# stripe.Customer.create(
#   name="Jenny Rosen",
#   email="jennyrosen@example.com",
# )

# print(stripe.Customer.list(limit=3))

import pymysql.cursors
from flask import Flask, request
from flask_cors import CORS
from flask_cors import cross_origin

import stripe

app = Flask(__name__)
CORS(app, origins = "*")
app.secret_key = "secret_key"

conn = pymysql.connect(
    host="localhost",
    user="root",
    password="",
    db="Verdant-Future",
    charset="utf8mb4",
    cursorclass=pymysql.cursors.DictCursor,
)

# @app.after_request
# def set_cors_headers(response):
#     response.headers['Access-Control-Allow-Origin'] = 'http://localhost:5173'
#     response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
#     response.headers['Access-Control-Allow-Methods'] = 'POST'
#     return response

# Initialize Stripe
stripe.api_key = 'sk_test_51Oe5AZKlgwtgt0eBACDFWMTEWAP1XzGbXa4MhgJRUaPIxza3JMJqcaNj4E2820ioJgPLJZiEQyAr3Y7CODV8Hxsm00BxyqGbKO'
@app.route('/transfer', methods=['POST'])

# @cross_origin()

def transfer_funds():
    # Get data from the request
    amount = request.form["amount"]
    source = request.form["source"]
    destination = request.form["destination"]
    
    print(stripe.Charge.create(
      amount= 100,
      currency="usd",
      source="acct_1P5t9bQSnkzLsREY",
    ))

    print(stripe.Transfer.create(
        amount= 50,
        currency='usd',
        destination="acct_1P5t9bQSnkzLsREY"
        # source_transaction = 'acct_1Oe5AZKlgwtgt0eB' # Use the transfer ID from the previous transfer
        # source_transaction = charge.id
    ))

    return {'message': 'Funds transferred successfully'}

if __name__ == '__main__':
    app.run(debug=True)
