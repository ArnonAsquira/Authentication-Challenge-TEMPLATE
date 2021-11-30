const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { errorHandler } = require('../middlewares/errorHnadler'); 
const { validateRegisterBody, validateExistingUser, validateUser, authenticateToken } = require('../middlewares/validateSchema');
const { USERS, INFORMATION, REFRESHTOKENS } = require('../usersDB');
const jwt = require('jsonwebtoken');
const { JWT_ACCES_SECRET, JWT_REFRESH_SECRET } = require('../env');

router.post('/register', validateRegisterBody,  validateExistingUser, async (req, res, next) => {
    const body = req.body;
    try {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.user.password = hashedPassword;
        USERS.push(body.user);
        INFORMATION.push({email: body.email, info: `${body.user.name} info`});
        res.status(201).send('Register Success');
    } catch (err) {
        next(err);
    }
})

router.post('/login',  validateUser, (req, res) => {
    const body = req.body;
    const user = USERS.find(user => user.email === body.email);
    const accessToken = jwt.sign(user, JWT_ACCES_SECRET, { expiresIn: "2m" });
    const refershToken = jwt.sign(user, JWT_REFRESH_SECRET);
    res.send({
        accessToken: accessToken,
        refreshToken: refershToken,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin    
    });
})



router.post('/tokenValidate', authenticateToken, (req, res, next) => {
    res.send({valid: true})
})

router.post('/token', (req, res, next) => {
    const body = req.body;
    res.send(body.refreshToken)
})


router.use(errorHandler);


module.exports = router;