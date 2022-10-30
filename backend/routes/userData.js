const express = require("express");
const router = express.Router();

//importing data model schemas
let { userdata } = require("../models/models"); 

//POST
router.post("/", (req, res, next) => { 
    userdata.create( 
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