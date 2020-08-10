import { Document, Types } from 'mongoose';
import { UserModel } from './user.model';
import { BaseModel } from './base.models';

export interface PersonModel extends Document, BaseModel {
    id: string;
    nome: string;
    sobrenome: string;
    cpf: string;
    user: UserModel;
}