const express = require('express');
const router = express();
const bcrypt = require('bcrypt');
const { errorHandler } = require('../middlewares/errorHnadler'); 
const { validateRegisterBody, validateExistingUser, validateUser, authenticateToken } = require('../middlewares/validateSchema');
const { USERS, INFORMATION, REFRESHTOKENS, updateINFORMTION, updateUSERS } = require('../usersDB');
const jwt = require('jsonwebtoken');
const { JWT_ACCES_SECRET, JWT_REFRESH_SECRET } = require('../env');
const { generateAccesToken } = require('../utils/jwtFunction');

router.post('/register', validateRegisterBody,  validateExistingUser, async (req, res, next) => {
    const body = req.body;
    try {
        const hashedPassword = await bcrypt.hash(body.password, 10);
        body.password = hashedPassword;
        updateUSERS(body);
        updateINFORMTION({email: body.email, info: `${body.name} info`})
        res.status(201).send('Register Success');
    } catch (err) {
        next(err);
    }
})

router.post('/login',  validateUser, (req, res, next) => {
    try {
        const body = req.body;
        const user = USERS.find(user => user.email === body.email);
        const accessToken = generateAccesToken(user, JWT_ACCES_SECRET);
        const refershToken = jwt.sign(user, JWT_REFRESH_SECRET);
        REFRESHTOKENS.push(refershToken);
        res.send({
            accessToken: accessToken,
            refreshToken: refershToken,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin    
        });
    } catch(err) {
        next(err);
    }
})

router.post('/tokenValidate', authenticateToken, (req, res, next) => {
    res.send({valid: true})
})

router.post('/token', (req, res, next) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).send('Refresh Token Required');
    if (!REFRESHTOKENS.includes(refreshToken)) return res.status(403).send('Invalid Refresh Token');
    jwt.verify(refreshToken, JWT_REFRESH_SECRET, (err, user) => {
        if (err) return res.status(403).send('Invalid Refresh Token');
        try{
            const accessToken = generateAccesToken({name: user.name, email: user.email, password: user.password, isAdmin: user.isAdmin}, JWT_ACCES_SECRET);
            res.send({accessToken: accessToken})  
        } catch (err) {
            next (err)
        }
    })
})

router.post('/logout', (req, res, next) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(400).send('Refresh Token Required');
    if (!REFRESHTOKENS.includes(refreshToken)) return res.status(400).send('Invalid Refresh Token');
    REFRESHTOKENS.forEach((token, i) => {
        if (token === refreshToken) {
            REFRESHTOKENS.splice(i, 1);
        }
    });
    res.send('User Logged Out Successfully')
})


router.use(errorHandler);


module.exports = router;