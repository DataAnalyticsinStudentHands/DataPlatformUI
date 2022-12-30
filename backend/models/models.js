const uuid = require('uuid');
const mongoose = require('mongoose');
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
    }
}, {
    collection: 'primaryData',
    timestamps: true
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
    attendees: [{
        type: String
    }]
}, {
    collection: 'eventData'
});

//collection for userData
let userDataSchema = new Schema({
    _id: { type: String, default: uuid.v1 },
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
const primarydata = mongoose.model('primaryData', primaryDataSchema);
const eventdata = mongoose.model('eventData', eventDataSchema);
const userdata = mongoose.model('userData', userDataSchema);
// package the models in an object to export 
module.exports = { primarydata, eventdata, userdata }
