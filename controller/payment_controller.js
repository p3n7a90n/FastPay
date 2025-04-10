const stripe = require('stripe')(process.env['STRIPE_SECRET_KEY']);
const {Users, Orders, MovieTickets} = require('../models/db')
const nodemailer = require('nodemailer');
const STRIPE_PUBLISHABLE_KEY = process.env['STRIPE_PUBLISHABLE_KEY']

const harcodedAdress = {name:"Demo", address: {city:"Bangalore", country: "IN", line1: "Demo Address", postal_code: "530068", state:"Karnataka"}}  // Sample address for dev environment in production this will user address

const addBalance =  async (req, res) => {
  let amount = parseInt(req.body.amount);

  if (isNaN(amount) || amount <= 0 || amount > 100000000) { 
    return res.status(400).send("Invalid amount");
  }

  const orderIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'INR',
      metadata: {
        customer: req.user.username,
        type: 'addBalance'
      },
      shipping: harcodedAdress,
      description: 'Online wallet',
      automatic_payment_methods: {
          enabled: true,
      }
  });
  res.render('checkout', {client_secret: orderIntent.client_secret, total: amount * 100, STRIPE_PUBLISHABLE_KEY});
}

// webhook controller to handle the payment status requests from stripe
const webhook = async (req, res) =>{
  const event = req.body
  switch (event.type) {
    case 'payment_intent.succeeded':
      console.log(JSON.stringify(req.body))
      if (req.body.data.object.metadata.type == 'addBalance'){
        const amountReceived = req.body.data.object.amount_received;
        const user = await Users.findOne({ attributes: ['walletBalance'], where: {username: req.body.data.object.metadata.customer}})
        await Users.update({walletBalance: user.walletBalance+amountReceived}, {where: {username: req.body.data.object.metadata.customer}})
      }
      if (req.body.data.object.metadata.type == 'onlineShoping'){
        await Orders.create({username: req.body.data.object.metadata.customer, itemName: req.body.data.object.metadata.itemName})
      }
      break;
    default:
      console.log('');
  }
  res.send();
}

const orderStatus = async (req, res) =>{
  res.render('orderStatus', {STRIPE_PUBLISHABLE_KEY})
}

const products = ["white-polo","black-polo"]

const onlineShopping =  async (req, res) => {  
  if (!products.includes(req.body.itemName)){
    return res.send('Invalid product ID!')
  }
  let price = parseInt(req.body.price);

  if (isNaN(price) || price <= 0 || price > 10000000) { 
    return res.status(400).send("Invalid amount");
  }
  const orderIntent = await stripe.paymentIntents.create({
      amount: price * 100,
      currency: 'INR',
      metadata: {
        customer: req.user.username,
        type: 'onlineShoping',
        itemName: req.body.itemName
      },
      shipping: harcodedAdress,
      description: 'Online shoping',
      automatic_payment_methods: {
          enabled: true,
      }
  });
  const product = req.body.itemName 
  res.render('checkout', {client_secret: orderIntent.client_secret, total:  price * 100, STRIPE_PUBLISHABLE_KEY});
}

function generateBookingReferenceNumber() {
  const timestamp = Date.now().toString(); 
  const randomPart = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); 
  return `BRID-${timestamp}-${randomPart}`;
}

const ticketPrice = {"The-Dark-Night-Rises":"30000"}

const bookMovieTicket = async (req, res)=>{
  if (!ticketPrice.hasOwnProperty(req.query.movieName)) {
    return res.send("Error: Movie not found")
  }
  const movieName = req.query.movieName
  const orderIntent = await stripe.paymentIntents.create({
    amount: ticketPrice[movieName],
    currency: 'INR',
    metadata: {
      movieName: movieName,
      customer: req.user.username,
      type: 'buyMovieTicket'
    },
    shipping: harcodedAdress,
    description: 'Online movie ticket booking',
    automatic_payment_methods: {
        enabled: true,
    }
  });
  const bookingReferenceId = generateBookingReferenceNumber()
  MovieTickets.create({bookingReferenceId: bookingReferenceId, movieName:movieName, username:req.user.username}) 
  res.render('buyMovieTicket', {client_secret: orderIntent.client_secret, total: ticketPrice[movieName], movieName: movieName, bookingReferenceId: bookingReferenceId, STRIPE_PUBLISHABLE_KEY});
}

const ticketBookingStatus = async(req, res)=>{
  res.render('ticketBookingStatus', {STRIPE_PUBLISHABLE_KEY})
}

function generateTicketId() {
  const randomPart1 = Date.now().toString(36); 
  const randomPart2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0'); 
  return `Ticket-${randomPart1}-${randomPart2}`;
}

const sendTicketBookingConfirmation = async (req, res)=>{
  const referenceId = req.body.referenceId
  const bookingDetails = await MovieTickets.findOne({where:{bookingReferenceId: referenceId}})
  if ((bookingDetails).length < 1) return res.send('Invalid Reference ID')
  const ticketId = generateTicketId()
  MovieTickets.update({ticketId: ticketId},{where:{bookingReferenceId: referenceId}})
  await sendTicketDetails(ticketId, bookingDetails)
  res.json({"message":"An email with the ticket details has been sent to your registered email address."})
}

const sendTicketDetails = async (ticketId, bookingDetails) => {
  const mailOptions = {
    from: 'booking@fastpay.com',
    to: bookingDetails.username,
    subject: `Your Ticket Booking Confirmation - Ticket ID [${ticketId}]`,
    text: `
Dear user,

Thank you for booking your movie ticket with FastPay! We are pleased to confirm your booking. Below are the details of your ticket:

Ticket Details:

    Movie Name: ${bookingDetails.movieName}
    Ticket ID: ${ticketId}

Important Information:

  Please arrive at the cinema hall at least 15 minutes before the showtime.
  Present this email at the ticket counter to collect your ticket.
  If you have any questions or need further assistance, please contact our customer support.

Thank you for choosing FastPay. Enjoy your movie!

Best regards,
FastPay
`
};

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Email sent: ' + info.response);
  });

}

const transporter = nodemailer.createTransport({
  host: process.env['SMTP_SERVER'],
  port: process.env['SMTP_PORT'],
  auth: 'None'
  // {
  //     user: process.env['SMTP_USER'],
  //     pass: process.env['SMTP_PASS']
  // }
});

module.exports = {
    onlineShopping: onlineShopping,
    orderStatus: orderStatus,
    webhook: webhook,
    addBalance: addBalance,
    bookMovieTicket: bookMovieTicket,
    ticketBookingStatus: ticketBookingStatus,
    sendTicketBookingConfirmation: sendTicketBookingConfirmation
}