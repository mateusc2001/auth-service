import { Document } from "mongoose";

export class UsuarioModel extends Document {
    public id: string;
    public usuario: string;
    public nomeCompleto: string;
    public dataCriacao: Date;
    public senha: string;
    public saldo: number;
    public base64image: string;
}