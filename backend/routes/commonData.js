const express = require("express"); //import express
const { validate } = require("uuid"); // uuid lets us use the _id as a string
const router = express.Router(); //creates an instance of the route handler

//importing data model schemas
let { commondata } = require("../models/models"); //imports the primarydata model from models.js}

//GET host:port/primaryData || this endpoint will use GET method to return all entries from primaryData collection, 
router.get("/", (req, res, next) => { // route method, path, followed by callback
    commondata.find( //model.find({filters}) finds documents, since we have no filters, it returns everything
        (error, data) => { // error handler
            if (error) {
                return next(error);
            } else {
                res.json(data); // returns the response data as json
            }
        }
    );
});

//GET host:port/commonData/:id || this endpoint will use GET method to return a doucment from primaryData collection, using :id as a parameter 
router.get("/clientdetails/", (req, res, next) => { // route method, path followed by a parameter, callback
    commondata.find( //model.find({filter}) finds documents based on the {filter}, can have many as long as they are seperated by comma.
        { _id: req.query.id }, // // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
        (error, data) => { // error handler
            if (error) {
                return next(error);
            } else {
                res.json(data); // returns the response data as json
                console.log(res.json.data)
            }
        }
    );
});

// //GET host:port/vommonData/users/?value=somevalue || finds documents based on req.query 
// router.get("/users/", (req, res, next) => { // route method, path followed by a query, callback
//     dbQuery = null
//     //Creates a 'starts with' filter
//     if (req.query["searchBy"] === 'name') {
//         dbQuery = { firstName: { $regex: `^${req.query["firstName"]}`, $options: "i" }, lastName: { $regex: `^${req.query["lastName"]}`, $options: "i" } }
//     } else if (req.query["searchBy"] === 'number') {
//         dbQuery = {
//             "phoneNumbers.primaryPhone": { $regex: `^${req.query["phoneNumbers.primaryPhone"]}`, $options: "i" }
//         }
//     };
//     primarydata.find( //model.find({filter}) finds documents based on the {filter}, can have many as long as they are seperated by comma.
//         dbQuery, // // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
//         (error, data) => { // error handler
//             if (error) {
//                 return next(error);
//             } else {
//                 res.json(data); // returns the response data as json
//             }
//         }
//     );
// });

//POST: host:port/commonData || this endpoint will use POST method to create document for primaryData collection, +
//Note: when you send the request body, you can exclude _id, since mongodb will automatically handle that.  
router.post("/", (req, res, next) => { // route method, path, callback 
    console.log("Creating New");
    commondata.create( //model.create() creates a new document using primarydata model
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

//POST: host:port/commonData || this endpoint will use POST method to create document for primaryData collection, +
//Note: when you send the request body, you can exclude _id, since mongodb will automatically handle that.  
router.post("/update", (req, res, next) => { // route method, path, callback 
    console.log("Found Existing");
    commondata.findOneAndUpdate( //model.create() creates a new document using primarydata model
    { client_id: req.params.id },
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
router.put("/users/:id", (req, res, next) => { // route method, path followed by parameter, callback 
    primarydata.findOneAndUpdate( //model.findOneAndUpdate({filter}) finds and updates a document based on what arguements you pass. filters are contained within brackets 
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

//GET host:port/primaryData/:id || this endpoint will use GET method to return a doucment from primaryData collection, using :id as a parameter 
router.get("/commondataform/", (req, res, next) => { // route method, path followed by a parameter, callback
    console.log("id: " + req.query.id);
    commondata.find( //model.find({filter}) finds documents based on the {filter}, can have many as long as they are seperated by comma.
        { client_id: req.query.id }, // // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
        (error, data) => { // error handler
            if (error) {
                return next(error);
            } else {
                console.log("data: "+data)
                res.json(data); // returns the response data as json
                
            }
        }
    );
});

// exports the router module so we can load it in app.js
module.exports = router;