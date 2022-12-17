const express = require("express");
// const mongoose = require('mongoose');
// const cors = require('cors');
const router = express.Router();
// const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();
//importing data model schemas
let { userdata } = require("../models/models"); 

const orgID = process.env.ORG_ID;

//POST to create login
router.post('/register', (req, res, next) => {

    const newUser = new userdata({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: bcrypt.hashSync(req.body.password, 10),
        organizationID: orgID,
        role: "Basic",
    })
    userdata.create( 
        newUser, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//login page
router.post('/login', (req, res, next) => {

    userdata.findOne({email: req.body.email,organizationID: orgID }, (err, userdata) => {
        console.log(userdata);
        if(err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        if (!userdata) {
            return res.status(401).json({
                title: 'User not found.',
                error: 'Invalid credentials.'
            })
        }
        //incorect password check
        if (!bcrypt.compareSync(req.body.password, userdata.password)) {
            return res.status(401).json({
                title: 'Login Failed.',
                error: 'Invalid Password.',
            })
        }
        //If all is good create a token and sent to frontend
        let token = jwt.sign({userId: userdata._id, userRole: userdata.role}, 'secretkey', {expiresIn: "10min"});
        return res.status(200).json({
            title: 'Login seccess',
            token: token,
        })

    })
});

//gets generated token from login and uses it to output the user's name for welcome message
router.get('/user', (req, res, next) => {
    let token = req.headers.token;
    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(401).json({
            title: 'unauthorized'
        })
        //token is valid
        userdata.findOne({_id: decoded.userId }, (err, user) => {
            if(err) return console.log(err)
            return res.status(200).json({
                title: 'User grabbed',
                user: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                }
            })
        })
    })
})
module.exports = router;
