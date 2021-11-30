/* write your server code here */
const express = require('express');
const app = express.Router();
const morgan = require('morgan');
const userRouters = require('./routers/userRouters');
const apiRouters = require('./routers/apiRouters');
const optionsRouters = require('./routers/optionsRouters');


app.use(express.json());
app.use(morgan('dev'));

app.use('/users', userRouters);

app.use('/api', apiRouters);

app.use('/', optionsRouters);


app.use((req, res, next) => {
    res.status(404).send('unknown endpoint');
})


module.exports = app;

