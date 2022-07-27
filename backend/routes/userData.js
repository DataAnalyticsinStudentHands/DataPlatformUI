const express = require("express"); //import express
const { validate } = require("uuid"); // uuid lets us use the _id as a string
const router = express.Router(); //creates an instance of the route handler

//importing data model schemas
let { users } = require("../models/models"); //imports the primarydata model from models.js}

// //GET host:port/primaryData || this endpoint will use GET method to return all entries from primaryData collection, 
// router.get("/", (req, res, next) => { // route method, path, followed by callback
//     primarydata.find( //model.find({filters}) finds documents, since we have no filters, it returns everything
//         (error, data) => { // error handler
//             if (error) {
//                 return next(error);
//             } else {
//                 res.json(data); // returns the response data as json
//             }
//         }
//     ).sort({ 'updatedAt': -1 }).limit(10);
// });

// //GET host:port/primaryData/:id || this endpoint will use GET method to return a doucment from primaryData collection, using :id as a parameter 
// router.get("/clientdetails/", (req, res, next) => { // route method, path followed by a parameter, callback
//     primarydata.find( //model.find({filter}) finds documents based on the {filter}, can have many as long as they are seperated by comma.
//         { _id: req.query.id }, // // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
//         (error, data) => { // error handler
//             if (error) {
//                 return next(error);
//             } else {
//                 console.log("data: "+ data)
//                 res.json(data); // returns the response data as json
                
//             }
//         }
//     );
// });

// //GET host:port/primaryData/users/?value=somevalue || finds documents based on req.query 
// //Ex: 'host:port/primaryData/users/?phoneNumbers.primaryPhone=3364560409' OR 'host:port/primaryData/users/?firstName=Amy'
// //Ex cont'd: you can also have multiple queries in the url using '&' || host:port/primaryData/users/?firstName=Amy&email=itsamy@gmail.com
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

//POST: host:port/primaryData || this endpoint will use POST method to create document for primaryData collection, +
//Note: when you send the request body, you can exclude _id, since mongodb will automatically handle that.  
router.post("/", (req, res, next) => { // route method, path, callback 
    console.log(req.body);
    users.create( //model.create() creates a new document using primarydata model
        req.body, //use the entire request body as the data for our new document: primarydata.create (req.body)
        (error, data) => { // error handler 
            if (error) {
                return next(error);//
            } else {
                res.json(data); // returns the response data as json
            }
        }
    );
    users.createdAt;
    users.updatedAt;
    users.createdAt instanceof Date;
});

//GET host:port/primaryData/:id || this endpoint will use GET method to return a doucment from primaryData collection, using :id as a parameter 
router.get("/login", (req, res, next) => { // route method, path followed by a parameter, callback
    users.find( //model.find({filter}) finds documents based on the {filter}, can have many as long as they are seperated by comma.
        { username: req.query.username, password: req.query.password }, // // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
        (error, data) => { // error handler
            if (error) {
                return next(error);
            } else {
                console.log("data: "+ data)
                res.json(data); // returns the response data as json
                
            }
        }
    );
});

router.get("/", (req, res, next) => {
    users.find(
        {
            _id: req.query._id
        },
        {
            perms: 1
        },
        (error, data) => {
            if(error) {
                return next(error);
            } else {
                console.log("data: "+data)
                res.json(data);
            }
        }
    )
})

router.get("/dash", (req, res, next) => {
    users.find(
        {
            _id: req.query._id
        },
        {
            perms:1
        },
        (error, data) => {
            if(error) {
                console.log(error)
                return next(error);
            } else {
                console.log("data: "+data)
               
                res.json(data);
            }
        }
    )
})

router.get("/basic", (req, res, next) => {
    users.find(
        {
            _id: req.query._id
        },
        {
            firstName:1,
            lastName:1,
            perms:1
        },
        (error, data) => {
            if(error) {
                return next(error);
            } else {
                console.log("data: "+data)
                res.json(data);
            }
        }
    )
})

// router.post("/loginGoogle", (req, res, next) => {

// })

// //PUT: host:port/primaryData || this endpoint will use PUT method to update an existing document, using :id as a parameter in primaryData collection,  
// //you can pass the existing document as your req.data, just be sure to exclude the _id field and _id value.
// router.put("/users/:id", (req, res, next) => { // route method, path followed by parameter, callback 
//     primarydata.findOneAndUpdate( //model.findOneAndUpdate({filter}) finds and updates a document based on what arguements you pass. filters are contained within brackets 
//         { _id: req.params.id }, // our first filter is to find document where _id matches the :id from our endpoint. ex: host:port/primaryData/12345 12345 is our req.params.id
//         req.body, //use the entire request body as the data for updated document. you can also do {$set: {field: req.body.matchingfield}} to updated only a set of specific properties.
//         (error, data) => { // error handler 
//             if (error) {
//                 return next(error);//
//             } else {
//                 res.json(data); // returns a message as a response
//             }
//         }
//     );
// });

// exports the router module so we can load it in app.js
module.exports = router;