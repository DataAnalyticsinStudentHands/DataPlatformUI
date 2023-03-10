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

//collection for intakeData
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
        primaryNumber:{
            unique: true,
            type: String,
            reqired: true
        },
        secondaryNumber:{
            type: String
        }
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
    primaryStatus:{
        activeStatus: {
            type:Boolean,
            default:true,
            required:true
        },
        statusChangeDate:{
            type:Date
        }
    }
}, {
    collection: 'primaryData',
    timestamps: true
});

//collection for eventData
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
    collection: 'eventData'
});

//collection for projectSchema
let projectSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

//collection for userData
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
    expiresAt: { 
        type: Date, 
        required: true }
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
const eventdata = mongoose.model('eventData', eventDataSchema);
const userdata = mongoose.model('userData', userDataSchema);
// package the models in an object to export 
module.exports = { orgdata, primarydata, eventdata, userdata }

