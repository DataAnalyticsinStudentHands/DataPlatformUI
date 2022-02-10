const uuid = require('uuid'); //uuid will allow us to store the _id as a string
const mongoose = require('mongoose'); //mongoose will be our ODM
const Schema = mongoose.Schema;

//collection for applicants

let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
      type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String
    },
    phoneNumbers: {
        type: Array
    },
    address: {
        type: Array
    },
    additionalData: {
        type: Array

    },
}, {
    collection: 'primaryData'
});

//collection for commonData

//create models for mongoose schema to use primaryData and commonData data model ('js', schema name)
const primarydata = mongoose.model('primaryData', primaryDataSchema); 

// package the models in an object to export 
module.exports = {primarydata}