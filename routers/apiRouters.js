const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const { errorHandler } = require('../middlewares/errorHnadler'); 
const { validateRegisterBody, validateExistingUser, validateUser, authenticateToken } = require('../middlewares/validateSchema');
const { USERS, INFORMATION, REFRESHTOKENS, updateUSERS, updateINFORMTION } = require('../usersDB');
const jwt = require('jsonwebtoken');
const { JWT_ACCES_SECRET, JWT_REFRESH_SECRET } = require('../env');

router.get('/v1/information',authenticateToken, (req, res, next) => {
   const info = updateINFORMTION().find(userInfo => userInfo.email === req.user.email);
   res.json([info]);
})


router.get('/v1/users',authenticateToken ,(req, res) => {
   if (!req.user.isAdmin) return res.status(403).send('unauthorized');
   res.json(updateUSERS());
})



router.use(errorHandler);


module.exports = router;