/* write your server code here */
const express = require('express');
const app = express.Router();
const morgan = require('morgan');
const userRouters = require('./routers/userRouters');
const apiRouters = require('./routers/apiRouters');

app.use(express.json());
app.use(morgan('dev'));


app.use('/users', userRouters);

app.use('/api', apiRouters);

app.options('/', (req, res) => {
    
})


app.use((req, res, next) => {
    res.send('unknown endpoint');
})


module.exports = app;