import { Schema, model } from 'mongoose'
import { UsuarioModel } from './model/usuario.model';

const usuarioSchemaObject = new Schema({
    usuario: { type: String, required: true, unique: true },
    nomeCompleto: { type: String, required: true },
    dataCriacao: { type: Date, default: Date.now },
    senha: { type: String, required: true },
    saldo: { type: Number, default: 0 },
    base64image: { type: String }
}, {
    timestamps: true
})

usuarioSchemaObject.set('toJSON', {
    virtuals: true
});

export const usuarioSchema = model<UsuarioModel>('usuario', usuarioSchemaObject);