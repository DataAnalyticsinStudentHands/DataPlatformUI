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

let permsSchema = new Schema({
    orgReadAccess: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    orgWriteAccess: {
        type: Number,
        required: true,
        min: 0,
        max: 4
    },
    allReadAccess: {
        type: Number,
        required: true,
        min: 0,
        max: 4
    },
    allWriteAccess: {
        type: Number,
        required: true,
        min: 0,
        max: 4
    },
    canCreateUser: {
        type: Number,
        required: true,
        min:0,
        max:1
    },
});

//collection for users
let userSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    firstName: {
        type: String,
        require: true
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
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    association: {
        type: String,
        required: true
    },
    perms: {
        type: permsSchema,
        required: true
    }
}, {
    collection: 'user',
    timestamps: true
});



//create models for mongoose schema to use primaryData and commonData data model ('js', schema name)
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const commondata = mongoose.model('commonData', commonDataSchema);
const perms = mongoose.model('pernsSchema', permsSchema);
const users = mongoose.model('users', userSchema);

// package the models in an object to export 
module.exports = { primarydata, commondata, users, perms }