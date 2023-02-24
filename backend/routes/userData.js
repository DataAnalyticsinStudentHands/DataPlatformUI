const express = require("express");
// const mongoose = require('mongoose');
// const cors = require('cors');
const router = express.Router();
// const session = require('express-session');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// require("dotenv").config();
//importing data model schemas
let { userdata } = require("../models/models"); 
const nodemailer = require("../services/nodemailer.config");
const randomString = require('randomstring');
const orgID = process.env.ORG_ID;
//importing authUser function to secure routes
const userAuthentication = require('../services/basicAuth');
let authUser = userAuthentication.authUser;

//POST
router.post('/register',(req, res, next) => {
    const filter = req.body.email;
    let userExists = false;
    //existing user check
     userdata.findOne({email: filter}, (err, userdata) => {
        if(err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        if (userdata) {
            userExists = true;
            return res.status(401).json({
                title: 'Existing Email',
                error: 'Email already exists.'
            })
        }
    })
    //if user does not already exist do the following
    const key = randomString.generate({
        length: 6,
        charset: 'numeric'
    });
    let date = new Date();
    const newUser = new userdata({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        password: bcrypt.hashSync(req.body.password, 10),
        organizationID: orgID, 
        //test
        role: "Basic",
        confirmationCode: key,
        expiresAt: date.setMinutes(date.getMinutes() + 1),
    })
    userdata.create( 
        newUser, 
        (error, data) => { 
            if(error){
                console.log(error)
            //     return res.status(500).json({
            //     title: 'server error',
            //     error: 'Email already exists.' 
            // })
            } 
            else {
                res.json(data);
                nodemailer.sendConfirmationEmail(
                    newUser.firstName,
                    newUser.email,
                    newUser.confirmationCode
                );
            }
            
        }
    );
    // nodemailer.sendConfirmationEmail(
    //     newUser.firstName,
    //     newUser.email,
    //     newUser.confirmationCode
    // );
});

//login page
router.post('/login', (req, res, next) => {
    userdata.findOne({email: req.body.email, organizationID: orgID }, (err, userdata) => {
        // console.log(userdata);
        if(err) return res.status(500).json({
            title: 'server error',
            error: err
        })
        //existing user check
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
        //active user check
        if (userdata.status != "Active") {
            return res.status(401).json({
                title: 'Pending user account',
                error: 'Pending Account. Please Verify Your Email.'
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
//user email confiramtion route
router.put('/verify', async (req, res, next) => {
    const filter = {confirmationCode: req.body.code};
    const update = {status: 'Active', 
                    confirmationCode: '',
                };
    userdata.findOne({confirmationCode: req.body.code }, async (err, user) => {
            if (user.expiresAt <= new Date()) {
                return res.status(401).json({
                    title: 'Expired code',
                    error: 'The code you entered has expired.'
                })
            }else{
                const updateSuccsses = await userdata.findOneAndUpdate(filter, update, {
                    returnOriginal: false
                });
                if (!updateSuccsses) {
                    return res.status(401).json({
                        title: 'User not found.',
                        error: 'Invalid code.'
                    })
                }
                return res.status(200).json({
                    title: ' seccess',
                    error: 'The account has been successfully activated.'
                })
            }
    })
    // const updateSuccsses = await userdata.findOneAndUpdate(filter, update, {
    //     returnOriginal: false
    // });
    // if (!updateSuccsses) {
    //     return res.status(401).json({
    //         title: 'User not found.',
    //         error: 'Invalid code.'
    //     })
    // }
    // return res.status(200).json({
    //     title: ' seccess',
    //     error: 'The account has been successfully activated.'
    // })
    
})
//reset password route
router.put('/resetPassword', async (req, res, next) => {
    const key = randomString.generate({
        length: 6,
        charset: 'numeric'
    });
    let date = new Date();
    const filter = {email: req.body.email};
    const update = {confirmationCode: key, expiresAt: date.setMinutes(date.getMinutes() + 1)};
    const updateSuccsses = await userdata.findOneAndUpdate(filter, update, {
        returnOriginal: false
    });
    if (!updateSuccsses) {
        return res.status(401).json({
            title: 'User not found.',
            error: 'Invalid email.'
        })
    }
    nodemailer.sendResetPasswordEmail(
        req.body.email,
        key
    );
    return res.status(200).json({
        title: ' seccess',
        error: 'Please check your email and follow the steps to reset your password.'
    })
    
})
//reset password form route
router.put('/resetPasswordForm', async (req, res, next) => {
    const newHashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
    const filter = {confirmationCode: req.body.code};
    const update = {password: newHashedPassword, 
                    confirmationCode: '',
                };
    userdata.findOne({confirmationCode: req.body.code }, async (err, user) => {
        if (!user) {
            return res.status(401).json({
                title: 'User not found.',
                error: 'Invalid code.'
            })
        }else if (user.expiresAt <= new Date()) {
            return res.status(401).json({
                    title: 'Expired code',
                    error: 'The code you entered has expired.'
                    })
        }
        else{
            const updateSuccsses = await userdata.findOneAndUpdate(filter, update, {
                returnOriginal: false
            });
            return res.status(200).json({
                title: ' seccess',
                error: 'Your password has been successfully reset.'
            })
        }
    })
})
//update password form route
router.put('/updatePasswordForm', async (req, res, next) => {
    const newHashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
    const oldPassword = req.body.code;
    const token = req.headers.token;
    console.log(token)
    jwt.verify(token, 'secretkey', async (err, decoded) => {
        if (err) return res.status(401).json({
            title: 'unauthorized',
            error: 'unauthorized'
        })
        //token is valid
        const filter = {_id: decoded.userId};
        userdata.findOne({_id: decoded.userId }, async (err, user) => {
            if(err) return console.log(err)
            if(!bcrypt.compareSync(oldPassword, user.password)){
                return res.status(401).json({
                    title: 'Old password false',
                    error: 'The current passwrod does not match our records.'
            })
            }else{
                let isPasswordUpdated = await userdata.updateOne(filter,{password: newHashedPassword})
                if (isPasswordUpdated) {
                    return res.status(200).json({
                        title: ' seccess',
                        error: 'Your password has been successfully updated.'
                    })
                }
            }
        })
    })
})
module.exports = router;



