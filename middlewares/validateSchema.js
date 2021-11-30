const { getUseres, adminEndpoints, authenticatedUserEndPoints, noTokenENdpoints, invalidTokenEndpoints } = require('../usersDB');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_ACCES_SECRET } = require('../env');

function validateBodySchema (req, res, next) {
    const body = req.body;
    if (!body.email || !body.name || !body.password) throw ('invalid request form');
    next()
}

function validateExistingUser (req, res, next) {
    const body = req.body;
    const isExistingUser = getUseres().find(user => user.name === body.name);
    if (isExistingUser) return res.status(409).send('user already exists');
    next ();
}

function validateUser (req, res, next) {
    const body = req.body;
    const user = getUseres().find(user => user.email === body.email);
    if (!user) return res.status(404).send('cannot find user');
    if (!bcrypt.compare(body.password, user.password)) return res.status(403).send('User or Password incorrect');
    next();
}

function authenticateToken(req, res, next) {
    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) return res.status(401).send('Access Token Required')
    jwt.verify(accessToken, JWT_ACCES_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Access Token');
        req.user = user;
        next();
    })
}


function checkEndpoints(req, res, next) {
    if (!req.headers.authorization) return res.send(noTokenENdpoints)
    const accessToken = req.headers.authorization.split(' ')[1];
    if (!accessToken) return res.send(noTokenENdpoints)
    jwt.verify(accessToken, JWT_ACCES_SECRET, (err, user) => {
        if (err) return res.send(invalidTokenEndpoints);
        if (user.isAdmin) {
            return res.send(adminEndpoints)
        } 
        res.send(authenticatedUserEndPoints)
    })

}

module.exports = {
    validateBodySchema,
    validateExistingUser,
    validateUser,
    authenticateToken,
    checkEndpoints
}