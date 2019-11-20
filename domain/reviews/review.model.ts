import { User } from './../users/user.model';
import { Restaurant } from './../restaurants/restaurant.model';
import * as mongoose from 'mongoose';

export interface Review extends mongoose.Document {
    date: Date;
    rating: number;
    comment: string;
    restaurant: Restaurant | mongoose.Types.ObjectId; // referencia o objeto restaurante ou outro objeto pelo ObjectId
    user: User | mongoose.Types.ObjectId; // referencia o objeto restaurante ou outro objeto pelo ObjectId
}

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

export const Review = mongoose.model<Review>('Review', reviewSchema);