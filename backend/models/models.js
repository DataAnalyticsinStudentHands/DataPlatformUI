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
    genericAccessLevel: {
        type: Number,
        min:0,  //0=only view self, 1=view nonsensitive data, 2=view, write nonsensitive data, 3=view nonprofit sensitive data (nonprofit admin), 4= view everything (overadmin)
        max:4,
        required: true
    },
    viewOverride: {
        type: Number,
        min:0,
        max:4,
    },
    editOverride: {
        type: Number,
        min:0,
        max:4
    },
    createUserOverride: {
        type: Number,
        min:0,
        max:4
    },
}, {
    collection: 'user',
    timestamps: true
});

//create models for mongoose schema to use primaryData and commonData data model ('js', schema name)
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const commondata = mongoose.model('commonData', commonDataSchema);
const users = mongoose.model('users', userSchema);

// package the models in an object to export 
module.exports = { primarydata, commondata, users }