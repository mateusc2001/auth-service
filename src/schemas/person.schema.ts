import { Schema, model } from 'mongoose'
import { PersonModel } from '../model/person.model';

const personSchemaObject = new Schema({
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

export const PersonSchema = model<PersonModel>('Person', personSchemaObject);