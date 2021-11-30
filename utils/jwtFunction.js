const { JWT_ACCES_SECRET, JWT_REFRESH_SECRET } = require('../env');
const jwt = require('jsonwebtoken');

function generateAccesToken(user, secret) {
    return jwt.sign(user, secret, { expiresIn: "10s" });
}


module.exports = {
    generateAccesToken,
}