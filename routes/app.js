const express = require('express')
const router = express.Router()
const { authenticateToken} = require('../controller/auth')
const auth_controller = require('../controller/auth')
const app_controller = require('../controller/app_controller')
const payment_controller = require('../controller/payment_controller') 

router.get('/register', auth_controller.register)

router.post('/register', auth_controller.register_post)

router.get('/login', auth_controller.login)

router.post('/login', auth_controller.login_post)

router.get('/', authenticateToken, app_controller.dashboard)

router.post('/onlineShopping', authenticateToken, payment_controller.onlineShopping)

router.get('/orderStatus', authenticateToken, payment_controller.orderStatus)

router.get('/addBalance', authenticateToken, payment_controller.addBalance)

router.post('/webhook', payment_controller.webhook)

router.post('/addBalance', authenticateToken , payment_controller.addBalance)

router.get('/viewOrders', authenticateToken, app_controller.showOrders)

router.get('/bookMovieTicket', authenticateToken, payment_controller.bookMovieTicket)

router.get('/ticketBookingStatus', authenticateToken, payment_controller.ticketBookingStatus)

router.post('/booking_confirmation', authenticateToken, payment_controller.sendTicketBookingConfirmation)

module.exports = {
  router
}
