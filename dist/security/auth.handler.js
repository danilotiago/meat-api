"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./../common/environment");
const user_model_1 = require("./../domain/users/user.model");
const restify_errors_1 = require("restify-errors");
const jwt = require("jsonwebtoken");
exports.authenticate = (req, resp, next) => {
    const { email, password } = req.body;
    user_model_1.User.findByEmail(email, '+password') // adicionamos o campo password para ser retornado tambem (por default nao vem)
        .then(user => {
        if (user && user.matches(password)) {
            const token = jwt.sign({
                sub: user.email,
                iss: 'meat-api'
            }, environment_1.environment.security.apiSecret);
            resp.json({
                name: user.name,
                email: user.email,
                accessToken: token
            });
            return next(false);
        }
        else {
            return next(new restify_errors_1.NotAuthorizedError('Invalid credentials'));
        }
    })
        .catch(next);
};
