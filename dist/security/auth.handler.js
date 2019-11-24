"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./../domain/users/user.model");
const restify_errors_1 = require("restify-errors");
exports.authenticate = (req, resp, next) => {
    const { email, password } = req.body;
    user_model_1.User.findByEmail(email, '+password') // adicionamos o campo password para ser retornado tambem (por default nao vem)
        .then(user => {
        if (user && user.matches(password)) {
            // gerar token
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid credentials'));
        }
    })
        .catch(next);
};
