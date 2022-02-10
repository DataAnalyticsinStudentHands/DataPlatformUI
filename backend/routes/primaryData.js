const express = require("express");
const { Mongoose } = require("mongoose");
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

//None Functional Only Test Code
router.post("/", (req, res, next) => {
  primarydata.create(req.body.client);
  res.send('Added the applicant.')
}
);

// exports the router
module.exports = router;