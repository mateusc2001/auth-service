import { Schema, model } from 'mongoose'
import { UserModel } from '../model/user.model';

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: Schema.Types.ObjectId, ref: 'Profile', required: true },
    person: { type: Schema.Types.ObjectId, ref: 'Person', required: true },
    desabilitado: { type: Boolean, default: false },
    inativo: { type: Boolean, default: false }
}, {
    timestamps: true
})

userSchema.set('toJSON', {
    virtuals: true
});

export const User = model<UserModel>('User', userSchema)