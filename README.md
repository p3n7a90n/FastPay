# FastPay

FastPay is a deliberately vulnerable payment gateway integration simulation app. It simulates a real-world checkout system using Stripe for payment processing — with intentional flaws for you to discover and exploit.

### 🎯 Purpose

Inspired by vulnerabilities identified in real-world applications, FastPay provides a controlled environment to help you discover, analyze, and exploit security flaws commonly found in actual payment gateway integrations.

It features realistic user flows such as adding balance to a wallet, purchasing clothes, booking movie tickets (with tickets delivered via email), and ordering food online.

---

## Screenshots

<table>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/0b4a3e59-f908-4d04-875b-8ef078f85e2c" alt="Checkout" width="600"/></td>
    <td><img src="https://github.com/user-attachments/assets/1313bb0e-cfaa-44c7-80db-6d467dc222e3" alt="Orders" width="600"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/68be4b4b-732f-4719-b356-c161e530209b" alt="Orders" width="600"/></td>
    <td><img src="https://github.com/user-attachments/assets/aa94e1db-9df6-4fb0-b9b8-b633df655286" alt="Checkout" width="600"/></td>
  </tr>
  <tr>
    <td><img src="https://github.com/user-attachments/assets/98b7610d-1f07-4d9e-8257-a03bf4aceefa" alt="Confirmation Email" width="600"/></td>
    <td><img src="https://github.com/user-attachments/assets/2e07f379-404f-40b7-a7ab-91ca3481d8ab" alt="Dashboard" width="600"/></td>
  </tr>
</table>

---

## 📦 Prerequisites

### 1. Stripe API Keys
Create a free Stripe account and grab your test API keys here:  
👉 https://dashboard.stripe.com/test/apikeys

Then, add the following to your `.env` file:
```env
STRIPE_SECRET_KEY=sk_test_**************
STRIPE_PUBLISHABLE_KEY=pk_test_**************
```

![Stripe Keys](https://github.com/user-attachments/assets/a438d34d-a1ef-44cf-abdb-24366e3b6bee)

---

### 2. Configure SMTP for Email Delivery

This app is preconfigured to use a free test SMTP service:  
👉 https://www.wpoven.com/tools/free-smtp-server-for-testing

No signup needed — just use any email ID when registering.

![SMTP Test Service](https://github.com/user-attachments/assets/58ba7295-e411-4ef8-b426-deb1af60f22b)

---

### 3. Add `fastpay.com` to your Hosts File (for domain simulation)
```bash
echo '127.0.0.1 fastpay.com' | sudo tee -a /etc/hosts
```

Then access the app at: [http://fastpay.com](http://fastpay.com)

---

### 4. Use Stripe Test Card (India Specific)
```text
Card Number: 4000 0035 6000 0008
Expiry Date: Any future date
CVV: Any 3-digit number
```

More test cards 👉 https://docs.stripe.com/testing?testing-method=card-numbers#India

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/tauh33dkhan/FastPay.git
cd FastPay
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Stripe Webhook Listener

Stripe sends webhook notifications when payments are completed. You’ll need to listen and forward them to your app:

```bash
npm install --save stripe
stripe login
stripe listen --forward-to localhost/webhook
```

---

### 4. Start the Server

```bash
node server.js
```

Now visit: [http://fastpay.com](http://fastpay.com)

---

## 🎯 Pentesting Objectives

Explore the system like a real attacker and discover all issues!

---

## 🙋‍♂️ Who is This For?

- Bug bounty hunters
- Security engineers
- CTF creators
- Payment security researchers
- Developers

---


## 🙏 Credits

Created by [@tauh33dkhan](https://github.com/tauh33dkhan)  
Built with ❤️ for the security community.
