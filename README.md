# FastPay

FastPay digital wallet

### Prerequisites

**1. Stripe API Keys**

Register for stripe account and obtain the required keys by navigating to following url and update the publishable key and secret key in `.env` file 
https://dashboard.stripe.com/test/apikeys

![image](https://github.com/user-attachments/assets/a438d34d-a1ef-44cf-abdb-24366e3b6bee)

**2. Update SMTP server details**

By default this application is configured to use Free SMTP server (https://www.wpoven.com/tools/free-smtp-server-for-testing) which also allows you to receive emails you can use any email to register account on FastPay. 
![image](https://github.com/user-attachments/assets/58ba7295-e411-4ef8-b426-deb1af60f22b)

**3. Test Card Details**

```
India
Number: 4000003560000008
Expiry: Any Future Date
CVV: Any three digit Number
```

**4. Add host**

```
echo '127.0.0.1 fastpay.com' > /etc/hosts
```

## Setup Stripe Webhook listener
```
npm install --save stripe
stripe login
stripe listen --forward-to localhost/webhook
```

For more cards refer to: https://docs.stripe.com/testing?testing-method=card-numbers#India


## Start Server

```
node server.js
```
