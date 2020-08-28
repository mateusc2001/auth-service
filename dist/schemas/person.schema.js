"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');


const personSchemaObject = new (0, _mongoose.Schema)({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    cpf: { type: String, required: true, maxlength: 11, minlength: 11, unique: true },
    dob: { type: Date },
    address: [
        {
            complement: { type: String, required: false },
            streetAddress: { type: String, required: true },
            number: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            zipCode: { type: String, required: true }
        }
    ],
    contactsInfo: {
        fones: [ String ],
        emails: [ String ]
    }
}, {
    timestamps: true
})

personSchemaObject.set('toJSON', {
    virtuals: true
});

 const PersonSchema = _mongoose.model('Person', personSchemaObject); exports.PersonSchema = PersonSchema;