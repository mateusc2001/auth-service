import { Schema, model } from 'mongoose'
import { PersonModel } from '../model/person.model';

const personSchema = new Schema({
    nome: String,
    sobrenome: String,
    cpf: { type: String, required: true, unique: true, maxlength: 11, minlength: 11 },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    desabilitado: { type: Boolean, default: false },
    inativo: { type: Boolean, default: false }
}, {
    timestamps: true
})

personSchema.set('toJSON', {
    virtuals: true
});

export const Person = model<PersonModel>('Person', personSchema)