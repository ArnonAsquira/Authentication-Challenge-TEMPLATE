const { USERS } = require('../usersDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_ACCES_SECRET, JWT_REFRESH_SECRET } = require('../env');

function validateRegisterBody (req, res, next) {
    const body = req.body;
    if (!body.email || !body.user || !body.password) throw ('invalid request form');
    next()
}

function validateExistingUser (req, res, next) {
    const body = req.body;
    console.log(USERS, body.user)
    const isExistingUser =  USERS.find(user => user.name === body.user.name);
    if (isExistingUser) return res.status(409).send('user already exists');
    next ();
}

function validateUser (req, res, next) {
    const body = req.body;
    const user = USERS.find(user => user.email === body.email);
    if (!user) return res.status(404).send('cannot find user');
    if (!bcrypt.compare(body.password, user.password)) return res.status(403).send('User or Password incorrect');
    next();
}

function authenticateToken(req, res, next) {
    console.log()
    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send('Access Token Required')
    jwt.verify(accessToken, JWT_ACCES_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Access Token');
        req.user = user;
        next();
    })
}

module.exports = {
    validateRegisterBody,
    validateExistingUser,
    validateUser,
    authenticateToken
}