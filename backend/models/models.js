const uuid = require('uuid');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orgDataSchema = new Schema ({
    organizationName: {
        type: String,
        required: true
    }
}, {
    collection: 'orgData',
    timestamps: true
});

//collection for primaryDataSchema
let primaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    organizationID: {
        type: Array,
        ref: 'orgData',
        required: true
    },
    firstName: {
        type: String,
        require: true
    },
    middleName: {
        type: String,
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
    primaryStatus:{
        activeStatus: {
            type:Boolean,
            default:true,
            required:true
        },
        statusChangeDate:{
            type:Date
        }
    },
    birthday: {
        month: {
            type: Number,
            required: true,
            min: 1,
            max: 12           
        },
        day: {
            type: Number,
            required: true,
            min: 1,
            max: 31
        }
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for secordaryDataSchema
let secordaryDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    clientID: { 
        type: String, 
        ref: 'primaryData', // connecting clientid to primaryData
        required: true
    },
    organizationID: {
        type: String,
        ref: 'orgData',
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
            required: true
        },
        county: {
            type: String,
        },
        zip: {
            type: String,
        }
    },
}, {
    collection: 'secordaryData',
    timestamps: true
});

//collection for eventDataSchema
let eventDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    organizationID: {
        type: Array,
        ref: 'orgData',
        required: true
    },
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
    attendees: [{
        type: String
    }]
}, {
    collection: 'eventData',
    timestamps: true
});

//collection for projectDataSchema
let projectDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
}, {
    collection: 'projectData',
    timestamps: true
});

//collection for userDataSchema
let userDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },    
    organizationID: {
        type: Array,
        ref: 'orgData',
        required: true
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String
    },
    email: {
        unique: true,
        type: String,
        required: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        length: 256,
    },
    role: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending',
    },
    confirmationCode: {
        type: String,
        unique: true
    },
}, {
    collection: 'userData',
    timestamps: true
});



// userDataSchema.path('email').validate(async (email) => {
//    const emailCount =  await mongoose.models.userData.countDocuments({ email })
//     return !emailCount
// }, title= 'EMAIL ALREADY EXISTS') 

// create models from mongoose schemas
const orgdata = mongoose.model('orgData', orgDataSchema);
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const secordarydata = mongoose.model('secordaryData', secordaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const projectdata = mongoose.model('projectData', eventDataSchema);
const userdata = mongoose.model('userData', userDataSchema);

// package the models in an object to export 
module.exports = { orgdata, primarydata, secordarydata, eventdata, projectdata, userdata }
