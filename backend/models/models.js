const uuid = require('uuid'); //uuid will allow us to store the _id as a string
const mongoose = require('mongoose'); //mongoose will be our ODM
const Schema = mongoose.Schema;

//collection for intakeData
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

//collection for eventData
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    eventName: {
        type: String,
        require: true
    },
    services: {
        type: Array
    },
    date: {
        type: Date,
        required: true
    },
    address: {
        line1: {
            type: String
        },
        line2: {
            type: String,
        },
        city: {
            type: String,
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
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

//create models for mongoose schema 
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const commondata = mongoose.model('commonData', commonDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);

// package the models in an object to export 
module.exports = { primarydata, commondata, eventdata }
