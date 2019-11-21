"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const restify_errors_1 = require("restify-errors");
const restaurant_model_1 = require("./restaurant.model");
class RestaurantsService {
    constructor() {
        this.findMenu = (req, resp, next) => {
            /**
             * +menu => faz a projecao dizendo que queremos alem do restaurante,
             * o menu tambem, como ele foi removido da consulta padrao devemos
             * explicitar que agora tambem queremos o menu
             */
            return restaurant_model_1.Restaurant.findById(req.params.id, '+menu')
                .then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError(`Restaurante de id ${req.params.id} não encontrado`);
                }
                resp.json(restaurant.menu);
                return next();
            }).catch(next);
        };
        this.replaceMenu = (req, resp, next) => {
            return restaurant_model_1.Restaurant.findById(req.params.id)
                .then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError(`Restaurante de id ${req.params.id} não encontrado`);
                }
                restaurant.menu = req.body;
                return restaurant.save();
            }).then(restaurant => {
                resp.json(restaurant.menu);
                return next();
            }).catch(next);
        };
        this.finbByName = (req, resp, next) => {
            if (!req.query.name) {
                return next();
            }
            restaurant_model_1.Restaurant.find({ name: req.query.name })
                .then(restaurant => {
                if (!restaurant) {
                    throw new restify_errors_1.NotFoundError(`Restaurante de nome ${req.query.name} não encontrado`);
                }
                resp.json(restaurant);
            }).catch(next);
        };
    }
}
exports.RestaurantsService = RestaurantsService;
