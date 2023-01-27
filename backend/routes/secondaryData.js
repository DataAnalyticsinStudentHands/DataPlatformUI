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

//POST
router.post("/", (req, res, next) => {
    // always use orgID from instance
    req.body.organizationID = orgID;
    
    //only add primarydata if searchParam is not in system
    secondarydata.findOne({ "clientID": req.body.clientID, organizationID: orgID }, (err, returndata) => {
        if(err) {
            return res.status(500).json({
            title: 'server error',
            error: err})
        }
        if (returndata) {
            secondarydata.findOne({ "clientID": req.body.clientID }, (err, returndata2) => {
                if(returndata2) {
                    return res.status(401).json({
                        title: "Has Existing Secondary Information",
                        error: 'Client has exists this information already associated in this organization.',
                        data: returndata2
                    })
                }
            })
        }
        else if (returndata == null) {
            secondarydata.create( 
                req.body,
                (error, data) => { 
                    if (error) {
                        return next(error);
                    } else {
                        return res.json(data);
                    }
                }
            );
            secondarydata.createdAt;
            secondarydata.updatedAt;
            secondarydata.createdAt instanceof Date;
        }
    });
});

//PUT update (make sure req body doesn't have the id)
router.put("/:id", (req, res, next) => { 
    // always use orgID from instance
    req.body.organizationID = orgID;
    secondarydata.findOneAndUpdate( 
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

module.exports = router;