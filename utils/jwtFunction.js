const { JWT_ACCES_SECRET, JWT_REFRESH_SECRET } = require('../env');

function generateAccesToken(user, secret) {
    return jwt.sign(user, secret, { expiresIn: "2m" });
}


module.exports = {
    generateAccesToken,
}