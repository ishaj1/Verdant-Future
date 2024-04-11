# Set your secret key. Remember to switch to your live secret key in production.
# See your keys here: https://dashboard.stripe.com/apikeys
import stripe
stripe.api_key = "sk_test_4eC39HqLyjWDarjtT1zdp7dc"

stripe.Account.create(type="express")

stripe.AccountLink.create(
  account='{{CONNECTED_ACCOUNT_ID}}',
  refresh_url="https://example.com/reauth",
  return_url="https://example.com/return",
  type="account_onboarding",
)

stripe.checkout.Session.create(
  mode="payment",
  line_items=[{"price": '{{PRICE_ID}}', "quantity": 1}],
  payment_intent_data={
    "application_fee_amount": 123,
    "transfer_data": {"destination": '{{CONNECTED_ACCOUNT_ID}}'},
  },
  success_url="https://example.com/success",
  cancel_url="https://example.com/cancel",
)



