const express = require("express"); //import express
const router = express.Router(); //creates an instance of the route handler

//importing data model schemas
let { eventdata } = require("../models/models"); //imports the primarydata model from models.js}

//GET host:port/primaryData || this endpoint will use GET method to return all entries from primaryData collection, 
router.get("/", (req, res, next) => { // route method, path, followed by callback
    eventdata.find( //model.find({filters}) finds documents, since we have no filters, it returns everything
        (error, data) => { // error handler
            if (error) {
                return next(error);
            } else {
                res.json(data); // returns the response data as json
            }
        }
    ).sort({ 'updatedAt': -1 }).limit(10);
});

//GET host:port/primaryData/:id || this endpoint will use GET method to return a doucment from primaryData collection, using :id as a parameter 
router.get("/eventdetails/", (req, res, next) => { // route method, path followed by a parameter, callback
    eventdata.find({ _id: req.query.id }, (error, data) => {
        if (error) {
            return next(error)
        } else {
            res.json(data)
        }
    })
});


router.get("/:id", (req, res, next) => { // route method, path followed by a parameter, callback
    eventdata.findOne({_id: req.params.id},(error, data) => {
        if (error) {
          return next(error)
        } else {
          res.json(data)
        }
    })
});

//POST: host:port/commonData || this endpoint will use POST method to create document for primaryData collection, +
//Note: when you send the request body, you can exclude _id, since mongodb will automatically handle that.  
router.post("/", (req, res, next) => { // route method, path, callback 
    eventdata.create( //model.create() creates a new document using primarydata model
        req.body, //use the entire request body as the data for our new document: commondata.create (req.body)
        (error, data) => { // error handler 
            if (error) {
                return next(error);//
            } else {
                res.json(data); // returns the response data as json
            }
        }
    );
});

//PUT: host:port/commonData || this endpoint will use PUT method to update an existing document, using :id as a parameter in primaryData collection,  
//you can pass the existing document as your req.data, just be sure to exclude the _id field and _id value.
router.put("/:id", (req, res, next) => { // route method, path followed by parameter, callback 
    console.log(req.body)
    eventdata.findOneAndUpdate( //model.findOneAndUpdate({filter}) finds and updates a document based on what arguements you pass. filters are contained within brackets 
        { _id: req.params.id }, // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
        req.body, //use the entire request body as the data for updated document. you can also do {$set: {field: req.body.matchingfield}} to updated only a set of specific properties.
        (error, data) => { // error handler 
            if (error) {
                return next(error);//
            } else {
                res.json(data); // returns a message as a response
            }
        }
    );
});

//need delete functionality

// exports the router module so we can load it in app.js
module.exports = router;