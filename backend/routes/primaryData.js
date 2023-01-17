const express = require("express"); 
const router = express.Router(); 
const jwt = require('jsonwebtoken');
require("dotenv").config();
//importing data model schemas
let { primarydata } = require("../models/models"); 
let { eventdata } = require("../models/models"); 
const orgID = process.env.ORG_ID;


//GET all entries
router.get("/", (req, res, next) => {
    let token = req.headers.token;
// let result = verifyToken(roken,data);

    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) {
            return res.status(401).json({
            title: 'unauthorized'
            })

        }
         //token is valid
        primarydata.find( {organizationID: orgID }, 
            (error, data) => {
                if (error) {
                    return next(error);
                } else {
                    res.json(data);
                }
            }
        ).sort({ 'updatedAt': -1 }).limit(10);
    })
});

//GET single entry by ID
router.get("/id/:id", (req, res, next) => {
    primarydata.find( { _id: req.params.id, organizationID: orgID}, 
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
        dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" },organizationID: orgID}
    } else if (req.query["searchBy"] === 'number') {
        dbQuery = {
            "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }, organizationID: orgID
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
    // always use orgID from instance
    req.body.organizationID = orgID;

    const searchParam = {
        "firstName": req.body.firstName, 
        "lastName": req.body.lastName,
        "birthday.month": req.body.birthday.month,
        "birthday.day": req.body.birthday.day
    };
    
    //only add primarydata if searchParam is not in system
    primarydata.findOne(searchParam, (err, returndata) => {
        console.log(searchParam);
        if(err) {
            return res.status(500).json({
            title: 'server error',
            error: err})
        }
        if (returndata) {
            primarydata.findOne({ "firstName": req.body.firstName, "lastName": req.body.lastName, "birthday.month": req.body.birthday.month,"birthday.day": req.body.birthday.day, organizationID: orgID }, (err, returndata2) => {
                console.log(returndata)
                if(returndata2) {
                    return res.status(401).json({
                        title: 'Existing Client',
                        error: 'Client already exists in this organization.'
                    })
                }
                else {
                    return res.status(401).json({
                        title: 'Non-Existing within this organization',
                        error: 'Client already exists in a different organization. Needs to be added.'
                    })
                }
            })
        }
        else if (returndata == null) {
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
            primarydata.createdAt;
            primarydata.updatedAt;
            primarydata.createdAt instanceof Date;
        }
    });
});

//PUT add Organization to Client
router.put("/addOrganization/:id", (req, res, next) => {
    //only add Organization if not yet in the array
    primarydata.find( 
        { _id: req.params.id }, 
        (error, data) => { 
            if (error) {
                return next(error);
            } else {
                if (data.length == 0) {
                    primarydata.updateOne(
                        { _id: req.params.id }, 
                        { $push: { organizationID: orgID } },
                        (error, data) => {
                            if (error) {
                                return next(error);
                            } else {
                                res.json(data);
                            }
                        }
                    );
                }
                
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