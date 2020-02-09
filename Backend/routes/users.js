const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../schemas/user');
const authCheck = require('../middleware/auth-check');

// get requests

router.get('', (req, res, next) => {
    res.sendFile('home.html', { root: '../View/home/' });
});

router.get('/signup', (req, res, next) => {

});

router.get('/login', (req, res, next) => {
    res.sendFile('login.html', { root: '../View/login/'})
});

// post requests

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            name: req.body.name,
            password: hash
        });
        user.save()
        .then(result => {
            res.status(201).json({
                message: 'User created.',
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error:err
            });
        });
    });
});

router.post("/login", authCheck, (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if(!user) {
            return res.status(401).json({
                message: 'Auth failed: Incorrect email address or password'
            });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
        if(!result) {
            return res.status(401).json({
                message: 'Auth failed: Incorrect email address or password'
            });
        }
        const token = jwt.sign({email: fetchedUser.email, name: fetchedUser.name, userId: fetchedUser._id}, 
            "nsstadmbctcfcmaysqpdmdavqtctmecalcbemcrrtvttedmsridbsteetpdqemctduff", 
            { expiresIn: "1h" }
            );
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id,
                name: fetchedUser.name
            });
            console.log(fetchedUser);
    })
    .catch(err => {
        return res.status(401).json({
            message: 'Auth failed'
        });
    });
});

module.exports = router;


