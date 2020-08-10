import { BaseModel } from "./base.models";
import { Document } from "mongoose";

export interface ProfileModel extends Document, BaseModel {
    profileName: string;
}