const uuid = require('uuid');
const mongoose = require('mongoose');
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

// package the models in an object to export both
module.exports = {primarydata}