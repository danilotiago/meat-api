import * as mongoose from 'mongoose'

export interface MenuItem extends mongoose.Document {
    name: string;
    price: number;
}

export const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
});