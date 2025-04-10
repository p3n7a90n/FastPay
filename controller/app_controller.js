const {Users, Orders} = require('../models/db')

const dashboard = async (req, res) => {
    if (req.user == 'false') {
        return res.redirect('/login')
    }
    const user = await Users.findOne({ attributes: ['walletBalance'], where: {username: req.user.username}})
    res.render('dashboard', { msg: req.user, walletBalance: user.walletBalance })
}

const showOrders = async (req, res) =>{
    if (req.user == 'false') {
        return res.redirect('/login')
    }
    const userOrders = await Orders.findAll({attributes: ['itemName'], where:{username: req.user.username}})
    res.render('showOrders', {userOrders: userOrders})
}

const notFound = (req, res) => {
    res.status(200).render('dashboard', { msg: req.user })
}

module.exports = {
    dashboard,
    showOrders,
    notFound
}