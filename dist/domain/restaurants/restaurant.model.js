"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const menu_item_model_1 = require("./menu-item.model");
const mongoose = require("mongoose");
const restSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    menu: {
        type: [menu_item_model_1.menuSchema],
        required: false,
        select: false,
        default: [] // seta um valor default para o menu
    }
});
exports.Restaurant = mongoose.model('Restaurant', restSchema);
