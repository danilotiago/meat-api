"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./../common/environment");
const restify = require("restify");
class Server {
    initRoutes() {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                this.application.get('/hello', (req, resp, next) => {
                    resp.json({
                        message: 'hello !!'
                    });
                    return next();
                });
                this.application.use(restify.plugins.queryParser());
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    bootstrap() {
        return this.initRoutes()
            .then(() => this);
    }
}
exports.Server = Server;
