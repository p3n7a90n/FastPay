const Sequelize = require('sequelize');
const md5 = require('md5');


const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite', 
    logging: false
});

sequelize
    .authenticate()
    .then(() => {
        console.log('Connected to database!');
    })
    .catch((err) => {
        console.error('Unable to connect to SQLite database:', err);
    });


const Users = sequelize.define('users', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    authToken_fp: Sequelize.STRING,
    jwt_token: Sequelize.STRING,
    walletBalance: Sequelize.INTEGER,
    paymentId: Sequelize.STRING
});

const Orders = sequelize.define('orders', {
    username: Sequelize.STRING,
    itemName: Sequelize.STRING
});

const MovieTickets = sequelize.define('movieTickets', {
    bookingReferenceId: Sequelize.STRING,
    movieName: Sequelize.STRING,
    username: Sequelize.STRING,
    ticketId: Sequelize.STRING
});

const FoodOrders = sequelize.define('foodOrders',{
    orderId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: Sequelize.STRING,
    orderItem: Sequelize.STRING,
    amount: Sequelize.INTEGER,
    name: Sequelize.STRING,
    addressLine1: Sequelize.STRING,
    addressLine2: Sequelize.STRING,
    city: Sequelize.STRING,
    state: Sequelize.STRING,
    country: Sequelize.STRING,
    postalCode: Sequelize.STRING,
    paymentId: Sequelize.STRING,
    orderStatus: Sequelize.STRING
})
sequelize.sync({ force: true })
    .then(async () => {
        await Users.create({
            username: 'charlie@fastpay.com',
            password: md5('charliebravoalpha@secret'),
            authToken_fp: 'placeholder',
            walletBalance: 0,
            paymentId: 'test'
        });

        await Orders.create({
            username: 'charlie@fastpay.com',
            itemName: 'white-polo'
        });

        await MovieTickets.create({
            bookingReferenceId: 'BRID-SAMPLE',
            movieName: 'SAMPLE MOVIE',
            username: 'charlie@fastpay.com',
            ticketId: 'TICKET-12123-12'
        });

        await FoodOrders.create({
            orderId: 5545,
            username: "charlie@fastpay.com",
            orderItem: "burger",
            amount: 220,
            paymentId: 'test',
            orderStatus: 'Confirmed',
            name: 'charlie',
            addressLine1: 'demo',
            addressLine2: 'demo',
            city: 'demo',
            state: 'demo',
            country: 'demo',
            postalCode: '242001'
        })
    })
    .catch((err) => {
        console.error('Error initializing database:', err);
    });

module.exports = {
    Users,
    Orders,
    MovieTickets,
    FoodOrders
};
