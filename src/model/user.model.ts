import { Document } from "mongoose";
import { BaseModel } from "./base.models";
import { ProfileModel } from "./profile.model";

export interface UserModel extends Document, BaseModel {
    id: string,
    username: string;
    password: string;
    profile: ProfileModel;
}