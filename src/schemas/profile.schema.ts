import { Schema, model } from 'mongoose'
import { ProfileModel } from '../model/profile.model';

const profileSchema = new Schema({
    profileName: { type: String, required: true, unique: true },
    desabilitado: { type: Boolean, default: false },
    inativo: { type: Boolean, default: false }
}, {
    timestamps: true
})

profileSchema.set('toJSON', {
    virtuals: true
});

export const Profile = model<ProfileModel>('Profile', profileSchema)