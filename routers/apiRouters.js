const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { errorHandler } = require('../middlewares/errorHnadler'); 
const { validateRegisterBody, validateExistingUser, validateUser, authenticateToken } = require('../middlewares/validateSchema');
const { USERS, INFORMATION, REFRESHTOKENS } = require('../usersDB');
const jwt = require('jsonwebtoken');
const { JWT_ACCES_SECRET, JWT_REFRESH_SECRET } = require('../env');


router.get('/v1/information',authenticateToken, (req, res, next) => {
   const Info = INFORMATION.find(userInfo => userInfo.email === req.user.email);
   res.send(Info);
})



router.use(errorHandler);


module.exports = router;