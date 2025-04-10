const Sequelize = require('sequelize');
const md5 = require('md5');

require("dotenv").config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
    dialect: 'mysql',
    dialectOptions: {
        host: process.env.DB_HOST
    }
})

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to database!')
    })
    .catch((err) => {
        console.log(err)
        console.log('Unable to connect to database!')
    });

const Users = sequelize.define('users', {
    'username': Sequelize.STRING,
    'password': Sequelize.STRING,
    'authToken_fp': Sequelize.STRING,
    'jwt_token': Sequelize.STRING,
    'walletBalance': Sequelize.INTEGER,
    'paymentId': Sequelize.STRING
})

const Orders = sequelize.define('orders', {
    'username': Sequelize.STRING,
    'itemName': Sequelize.STRING
})


const MovieTickets = sequelize.define('movieTickets',{
    'bookingReferenceId': Sequelize.STRING,
    'movieName': Sequelize.STRING,
    'username': Sequelize.STRING,
    'ticketId': Sequelize.STRING
})

sequelize.sync({ force: true })
    .then(() => {
        // create a demo user to intialize the users table in dev env
        Users.create({
            username: 'charlie@fastpay.com',
            password: md5('charliebravoalpha@secret'),
            authToken_fp: 'placeholder',
            walletBalance: 0,
            paymentId: 'test'
        })
        Orders.create({
            username: 'charlie@fastpay.com',
            itemName: 'white-polo'
        })
        MovieTickets.create({
            'bookingReferenceId': 'BRID-SAMPLE',
            'movieName': 'SAMPLE MOVIE',
            'username': 'charlie@fastpay.com',
            'ticketId': 'TICKET-12123-12'
        })
    .catch((err) => {
        console.log(err)
        console.log('Unable to connect to database!')
    });
})

module.exports = {
    Users,
    Orders,
    MovieTickets
}
