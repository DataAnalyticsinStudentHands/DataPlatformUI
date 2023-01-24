const express = require("express"); 
const router = express.Router(); 
require("dotenv").config();
//importing data model schemas
let { secondarydata } = require("../models/models"); 
const orgID = process.env.ORG_ID;

//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    secondarydata.find( { _id: req.params.id, organizationID: orgID}, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});