const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const { errorHandler } = require('../middlewares/errorHnadler'); 
const { authenticateToken } = require('../middlewares/validateSchema');
const { getInformation, getUseres } = require('../usersDB');

router.get('/v1/information',authenticateToken, (req, res, next) => {
   const info = getInformation().find(userInfo => userInfo.email === req.user.email);
   res.json([info]);
})


router.get('/v1/users',authenticateToken ,(req, res) => {
   if (!req.user.isAdmin) return res.status(403).send('unauthorized');
   res.json(getUseres());
})

router.use(errorHandler);

module.exports = router;