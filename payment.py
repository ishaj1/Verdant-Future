from flask import Flask, jsonify, request
from flask_cors import CORS
import stripe

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Set your Stripe API key
stripe.api_key = 'sk_test_51Oe5AZKlgwtgt0eBACDFWMTEWAP1XzGbXa4MhgJRUaPIxza3JMJqcaNj4E2820ioJgPLJZiEQyAr3Y7CODV8Hxsm00BxyqGbKO'

@app.route('/charge', methods=['POST'])
def charge():
    try:
        # Retrieve the payment information from the frontend
        data = request.get_json()

        # Create a charge using Stripe
        charge = stripe.PaymentIntent.create(
            amount=data['amount'],
            currency='usd',
            description='Payment for your product or service',
            payment_method=data['token'],  # obtained with Stripe.js on the client side
            confirmation_method='manual',
            confirm=True,
        )

        # You can perform additional
        return jsonify({'status': 'success', 'message': 'Payment processed successfully'})

    except stripe.error.StripeError as e:
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
