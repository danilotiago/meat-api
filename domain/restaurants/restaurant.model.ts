import { MenuItem, menuSchema } from './menu-item.model';
import * as mongoose from 'mongoose';

export interface Restaurant extends mongoose.Document {
    name: string;
    menu: MenuItem[];
}

const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [menuSchema],
        required: false,
        select: false, // nao retorna o menu quando fizermos um select nos restaurantes
        default: [] // seta um valor default para o menu
    }
});

export const Restaurant = mongoose.model<Restaurant>('Restaurant', restSchema);