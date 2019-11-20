"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify_errors_1 = require("restify-errors");
var mpContentType = 'application/merge-patch+json';
exports.mergePatchBodyParser = function (req, resp, next) {
    if (req.getContentType() === mpContentType &&
        req.method === 'PATCH') {
        // guarda o body original antes de tentar converter
        req.rawBody = req.body;
        try {
            req.body = JSON.parse(req.body);
        }
        catch (err) {
            next(new restify_errors_1.BadRequestError("Invalid content: " + err.message));
        }
    }
    return next();
};
