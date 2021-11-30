const { checkEndpoints } = require('../middlewares/validateSchema');
const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const { errorHandler } = require('../middlewares/errorHnadler'); 
const jwt = require('jsonwebtoken');

router.options('', checkEndpoints, (req, res) => {
    res.header({Allow: "OPTIONS, GET, POST"})
    res.json([...req.options]);
})

module.exports = router;