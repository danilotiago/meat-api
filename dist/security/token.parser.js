"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./../common/environment");
const user_model_1 = require("./../domain/users/user.model");
const jwt = require("jsonwebtoken");
exports.tokenParser = (req, resp, next) => {
    const token = extractToken(req);
    if (token) {
        jwt.verify(token, environment_1.environment.security.apiSecret, applyBearer(req, next));
    }
    else {
        next();
    }
};
function extractToken(req) {
    const authorization = req.header('authorization');
    if (authorization) {
        const parts = authorization.split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
            return parts[1];
        }
    }
    return null;
}
function applyBearer(req, next) {
    return (error, decoded) => {
        if (decoded) {
            user_model_1.User.findByEmail(decoded.sub)
                .then(user => {
                if (user) {
                    // associa o user ao request
                    req.authenticated = user;
                }
                next();
            });
        }
        else {
            next();
        }
    };
}
