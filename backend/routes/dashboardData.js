const express = require("express");
const router = express.Router();
require("dotenv").config();

//importing data model schemas
let { eventdata } = require("../models/models"); 
let { primarydata } = require("../models/models"); 

const orgID = process.env.ORG_ID;

// code to get previous 2 months for dashboard
//https://stackoverflow.com/questions/48307611/mongodb-query-group-collection-by-date-last-week-month-all-nodejs
router.get('/recentEvent/', (req, res, next) => {
    const today = new Date();
    var twomonths = new Date();
    today.setMonth(today.getMonth() - 2);   //establish two months prior

    eventdata.aggregate([{
        //https://www.mongodb.com/docs/manual/aggregation/
        //filtering for organization name first
        $match:{organizationID: orgID}
    },
        //returns only event name, date, and amount of attendees
        {$project:{_id:0, eventName:1, date:1, attendees:{$size:"$attendees"}}},
    { $match : { date : {
        '$gte':today,
        '$lt':twomonths
    }}},

], (error, data) => {
        if (error) { return next(error) } 
        else { res.json(data); }
    }).sort({date:1});
  });

router.get('/primaryZipCodes/', (req, res, next) => {
  primarydata.aggregate([
      {$match:{organizationID: orgID}},
      {$group:{_id: {"primary_zip": "$address.zip"}, count: {$count: {}}}}
  ], (error, data) => {
      if (error) { return next(error) } 
      else { res.json(data); }
  });
});

router.get('/eventZipCodes/', (req, res, next) => {
  eventdata.aggregate([
      {$match:{organizationID: orgID}},
      {$group:{_id: {"event_zip": "$address.zip"}, count: {$count: {}}, }}
  ], (error, data) => {
      if (error) { return next(error) } 
      else { res.json(data); }
  });
});
module.exports = router;