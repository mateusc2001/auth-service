import { Schema, model } from 'mongoose'

const profileSchemaObject = new Schema({
    profileName: { type: String, required: true },
}, {
    timestamps: true
})

profileSchemaObject.set('toJSON', {
    virtuals: true
});

export const ProfileSchema = model('Profile', profileSchemaObject);