const express = require("express"); 
const router = express.Router(); 
require("dotenv").config();

//importing data model schemas
let { primarydata } = require("../models/models"); 
const orgID = process.env.ORG_ID;

//GET all entries per instance
router.get("/", (req, res, next) => { 
    primarydata.find( {organizationID: orgID }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    primarydata.find( 
        { _id: req.params.id, organizationID: orgID }, 
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//GET entries based on search query
//Ex: '...?firstName=Bob&lastName=&searchBy=name' 
router.get("/search/", (req, res, next) => { 
    let dbQuery = "";
    if (req.query["searchBy"] === 'name') {
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" },organizationID: orgID }
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" },organizationID: orgID
        }
    };
    primarydata.find( 
        dbQuery, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//POST
router.post("/", (req, res, next) => { 
    // add orgID from instance
    req.body.organizationID = orgID;

    primarydata.create( 
        req.body,
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                res.json(data); 
            }
        }
    );
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    // always use orgID from instance
    req.body.organizationID = orgID;
    primarydata.findOneAndUpdate( 
        { _id: req.params.id }, 
        req.body,
        (error, data) => {
            if (error) {
                return next(error);
            } else {
                res.json(data);
            }
        }
    );
});

//PUT soft delete  (make sure req body doesn't have the id)
router.put("/delete/:id", (req, res, next) => { 
    // always use orgID from instance
    let date = new Date();
    req.body.organizationID = orgID;
    primarydata.findOneAndUpdate( 
        { _id: req.params.id }, 
        [{$set: {"primaryStatus.activeStatus": req.body.status, "primaryStatus.statusChangeDate": date}}],
        (error, data) => {
            res.json(data);
        }
    );
});

module.exports = router;