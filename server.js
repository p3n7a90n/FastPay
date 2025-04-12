var express = require('express')
var app = express()
require('dotenv').config();
const {router} = require('./routes/app');
const cookieParser = require('cookie-parser');

app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

app.use(cookieParser());
app.set('view engine', 'ejs');
app.use(express.static('./assets'));
app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(router);

app.listen(80, ()=>{console.log("listening on port 80")})

