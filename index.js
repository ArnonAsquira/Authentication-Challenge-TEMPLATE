/* write the code to run app.js here */
const express = require('express');
const server = express();
const morgan = require('morgan');
const app = require('./app');

const port = process.env.port || 3000;

server.use(app);

server.listen(port, (err) => {
    if (err) return console.log(err);
    console.log(`app listening on port ${port}`)
})