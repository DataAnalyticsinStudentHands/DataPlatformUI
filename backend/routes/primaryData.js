const express = require("express"); //import express
const {validate} = require("uuid"); // uuid lets us use the _id as a string
const router = express.Router(); //creates an instance of the route handler

//importing data model schemas
let {primarydata} = require("../models/models"); //imports the primarydata model from models.js}

//GET host:port/primaryData || this endpoint will use GET method to return all entries from primaryData collection, 
router.get("/", (req, res, next) => { // route method, path, followed by callback
    primarydata.find( //model.find({filters}) finds documents, since we have no filters, it returns everything
        (error, data) => { // error handler
            if (error) {
                return next(error);
            } else {
                res.json(data); // returns the response data as json
            }
        }
    );
});

//GET host:port/primaryData/:id || this endpoint will use GET method to return a doucment from primaryData collection, using :id as a parameter 
router.get("/:id", (req, res, next) => { // route method, path followed by a parameter, callback
  primarydata.findOne( //model.find({filter}) finds documents based on the {filter}, can have many as long as they are seperated by comma.
    { _id: req.params.id}, // // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
      (error, data) => { // error handler
          if (error) {
              return next(error);
          } else {
              res.json(data); // returns the response data as json
          }
      }
  );
});

//POST: host:port/primaryData || this endpoint will use POST method to create document for primaryData collection,  
router.post("/", (req, res, next) => { // route method, path, callback 
  primarydata.create( //model.create() creates a new document using primarydata model
    req.body, //use the entire request body as the data for our new document: primarydata.create (req.body)
      (error, data) => { // error handler 
          if (error) {
              return next(error);//
          } else {
              res.json(data); // returns the response data as json
          }
      }
  );
});

//PUT: host:port/primaryData || this endpoint will use PUT method to update an existing document, using :id as a parameter in primaryData collection,  
/* router.put("/:id", (req, res, next) => { // route method, path followed by parameter, callback 
  primarydata.findOneAndUpdate( //model.findOneAndUpdate({filter}) finds and updates a document based on what arguements you pass. filters are contained within brackets 
    { _id: req.params.id }, // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
    req.body, //use the entire request body as the data for updated document. you can also do {$set: {field: req.body.matchingfield}} to updated only a set of specific properties.
      (error, data) => { // error handler 
          if (error) {
              return next(error);//
          } else {
              res.send('Updated the Primary Data for client'); // returns a message as a response
          }
      }
  );
}); */

// exports the router module so we can load it in app.js
module.exports = router;