"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');

const profileSchemaObject = new (0, _mongoose.Schema)({
    profileName: { type: String, required: true },
}, {
    timestamps: true
})

profileSchemaObject.set('toJSON', {
    virtuals: true
});

 const ProfileSchema = _mongoose.model.call(void 0, 'Profile', profileSchemaObject); exports.ProfileSchema = ProfileSchema;