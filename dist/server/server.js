"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const environment_1 = require("./../common/environment");
const restify = require("restify");
const mongoose = require("mongoose");
class Server {
    initDb() {
        return mongoose.connect(environment_1.environment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    initRoutes(routers) {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                // loop para inicializar as rotas
                routers.forEach(route => route.applyRoutes(this.application));
                // parse dos queryParams
                this.application.use(restify.plugins.queryParser());
                // parse do Body da requisicao
                this.application.use(restify.plugins.bodyParser());
                this.application.listen(environment_1.environment.server.port, () => {
                    resolve(this.application);
                });
            }
            catch (err) {
                reject(err);
            }
        });
    }
    bootstrap(routers = []) {
        // se o banco subir OK, sobe as rotas
        return this.initDb().then(() => this.initRoutes(routers).then(() => this));
    }
}
exports.Server = Server;
