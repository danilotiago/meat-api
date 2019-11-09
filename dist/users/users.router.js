"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./../dist/users/user.model");
const router_1 = require("../common/router");
class UsersRouter extends router_1.Router {
    applyRoutes(application) {
        application.get('/users', (req, resp, next) => {
            user_model_1.User.all()
                .then(users => {
                resp.json(users);
                return next();
            });
        });
    }
}
exports.usersRouter = new UsersRouter();
