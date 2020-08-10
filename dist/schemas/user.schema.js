"use strict";Object.defineProperty(exports, "__esModule", {value: true});var _mongoose = require('mongoose');


const userSchema = new (0, _mongoose.Schema)({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profile: { type: _mongoose.Schema.Types.ObjectId, ref: 'Profile', required: true },
    desabilitado: { type: Boolean, default: false },
    inativo: { type: Boolean, default: false }
}, {
    timestamps: true
})

userSchema.set('toJSON', {
    virtuals: true
});

 const User = _mongoose.model('User', userSchema); exports.User = User