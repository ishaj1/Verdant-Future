# from flask import Flask, jsonify, request
# from flask_cors import CORS
# import stripe

# app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes

# # Set your Stripe API key
# stripe.api_key = 'sk_test_51Oe5AZKlgwtgt0eBACDFWMTEWAP1XzGbXa4MhgJRUaPIxza3JMJqcaNj4E2820ioJgPLJZiEQyAr3Y7CODV8Hxsm00BxyqGbKO'

# @app.route('/charge', methods=['POST'])
# def charge():
#     try:
#         # Retrieve the payment information from the frontend
#         data = request.get_json()

#         # Create a charge using Stripe
#         charge = stripe.PaymentIntent.create(
#             amount=data['amount'],
#             currency='usd',
#             description='Payment for your product or service',
#             payment_method=data['token'],  # obtained with Stripe.js on the client side
#             confirmation_method='manual',
#             confirm=True,
#         )

#         # You can perform additional
#         return jsonify({'status': 'success', 'message': 'Payment processed successfully'})

#     except stripe.error.StripeError as e:
#         return jsonify({'status': 'error', 'message': str(e)})

# if __name__ == '__main__':
#     app.run(debug=True)

#! /usr/bin/env python3.6
"""
Python 3.6 or newer required.
"""
import json
import os
import stripe

# This is your test secret API key.
stripe.api_key = 'sk_test_51Oe5AZKlgwtgt0eBACDFWMTEWAP1XzGbXa4MhgJRUaPIxza3JMJqcaNj4E2820ioJgPLJZiEQyAr3Y7CODV8Hxsm00BxyqGbKO'

from flask import Flask, render_template, jsonify, request


app = Flask(__name__, static_folder='public',
            static_url_path='', template_folder='public')

def calculate_order_amount(items):
    # Replace this constant with a calculation of the order's amount
    # Calculate the order total on the server to prevent
    # people from directly manipulating the amount on the client
    return 1400


@app.route('/create-payment-intent', methods=['POST'])
def create_payment():
    try:
        data = json.loads(request.data)
        # Create a PaymentIntent with the order amount and currency
        intent = stripe.PaymentIntent.create(
            amount=calculate_order_amount(data['items']),
            currency='usd',
            # In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods={
                'enabled': True,
            },
        )
        return jsonify({
            'clientSecret': intent['client_secret']
        })
    except Exception as e:
        return jsonify(error=str(e)), 403

if __name__ == '__main__':
    app.run(port=4242)
