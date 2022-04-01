const uuid = require('uuid'); //uuid will allow us to store the _id as a string
const mongoose = require('mongoose'); //mongoose will be our ODM
const Schema = mongoose.Schema;

//collection for applicants
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
        // Remove requirement for middlename??
        //// require: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    phoneNumbers: {
        type: Array,
        required: true
    },
    address: {
        type: Array
    },
    events: {
        type: Array
    },    
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for commonData
let commonDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    client_id: {
        type: String,
        require: true
    },
    birthdate: {
        type: Date,
        require: true
    },
    socialSecurity: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    sex: {
        type: String,
        required: true
    },
    ethnicity: {
        type: String,
        required: true
    },
    education: {
        type: Array
    },
    healthInsurance: {
        type: Array
    },
    foodStamps: {
        type: Array
    },
    income: {
        type: Array
    },
    employment: {
        type: Array
    },
    priorityPopulation: {
        type: Array
    },
    additionalData: {
        type: Array
    },
}, {
    collection: 'commonData'
});

//collection for organizationData
let organizationDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    orgName: {
        type: String,
        require: true
    },
    orgDescription: {
        type: String,
        required: true
    },
    services: {
        type: Array
    },
    events: {
        type: Array
    },    
}, {
    collection: 'organizationData'
});

//collection for organizationData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true
    },
    associatedOrgID: {
        type: String,
        required: true
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },
    address: {
        type: Array
    },
    description: {
        type: String,
    },
    attendees: {
        type: Array
    }    
}, {
    collection: 'eventData'
});

//create models for mongoose schema to use primaryData and commonData data model ('js', schema name)
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const commondata = mongoose.model('commonData', commonDataSchema);
const orgdata = mongoose.model('organzationData', organizationDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);

// package the models in an object to export 
module.exports = { primarydata, commondata, orgdata, eventdata }