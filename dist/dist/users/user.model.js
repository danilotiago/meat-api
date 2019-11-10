"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        select: false
    }
});
// quando User, ja define que a collection sera users
exports.User = mongoose.model('User', userSchema);
