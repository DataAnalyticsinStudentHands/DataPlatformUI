const express = require("express");
const router = express.Router();
require("dotenv").config();

//importing data model schemas
let { orgdata } = require("../models/models"); 

//GET instance name
router.get("/", (req, res, next) => { 
    orgdata.find({ _id: process.env.ORG_ID }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data.organizationName)
        }
    })
});

module.exports = router;