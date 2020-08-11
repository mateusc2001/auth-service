import { Schema, model } from 'mongoose'
import { UserModel } from '../model/user.model';

const userSchemaObject = new Schema({
    username: { type: String, required: false, unique: true },
    password: { type: String, required: true },
    person: { type: Schema.Types.ObjectId, ref: "Person" },
    profile: { type: Schema.Types.ObjectId, ref: "Profile" }
}, {
    timestamps: true
})

userSchemaObject.set('toJSON', {
    virtuals: true
});

export const UserSchema = model<UserModel>('User', userSchemaObject);