"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');


const userSchemaObject = new (0, _mongoose.Schema)({
    username: { type: String, required: false, unique: true },
    password: { type: String, required: true },
    person: { type: _mongoose.Schema.Types.ObjectId, ref: "Person" },
    profile: { type: _mongoose.Schema.Types.ObjectId, ref: "Profile" }
}, {
    timestamps: true
})

userSchemaObject.set('toJSON', {
    virtuals: true
});

 const UserSchema = _mongoose.model('User', userSchemaObject); exports.UserSchema = UserSchema;