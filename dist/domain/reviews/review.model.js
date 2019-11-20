"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true,
        maxlength: 500
    },
    restaurant: {
        // sera um tipo ObjectId, para referenciar um id de outra collection
        type: mongoose.Schema.Types.ObjectId,
        // nome da collection que sera referenciada
        ref: 'Restaurant',
        require: true
    },
    user: {
        // sera um tipo ObjectId, para referenciar um id de outra collection
        type: mongoose.Schema.Types.ObjectId,
        // nome da collection que sera referenciada
        ref: 'User',
        require: true
    }
});
exports.Review = mongoose.model('Review', reviewSchema);
