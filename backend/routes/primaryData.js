const express = require("express");
const { validate } = require("uuid");
const router = express.Router();

//importing data model schema's
let { primarydata } = require("../models/models");

// gets all of primaryData from db
router.get("/", (req, res, next) => {
    primarydata.find(
      {},
      (error, data) => {
        // error handler
        if (error) {
          return next(error);
        } else {
          res.json(data);
        }
      }
    );
  });

// exports the router
module.exports = router;