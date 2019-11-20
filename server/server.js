"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var error_handler_1 = require("./error-handler");
var merge_path_parser_1 = require("./merge-path.parser");
var environment_1 = require("./../common/environment");
var restify = __importStar(require("restify"));
var mongoose = __importStar(require("mongoose"));
var Server = /** @class */ (function () {
    function Server() {
    }
    Server.prototype.initDb = function () {
        return mongoose.connect(environment_1.environment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    };
    Server.prototype.initRoutes = function (routers) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });
                // loop para inicializar as rotas
                routers.forEach(function (route) { return route.applyRoutes(_this.application); });
                // parse dos queryParams
                _this.application.use(restify.plugins.queryParser());
                // parse do Body da requisicao
                _this.application.use(restify.plugins.bodyParser());
                // parse do Body da requisicao via merge-patch+json
                _this.application.use(merge_path_parser_1.mergePatchBodyParser);
                _this.application.listen(environment_1.environment.server.port, function () {
                    resolve(_this.application);
                });
                _this.application.on('restifyError', error_handler_1.handleError);
            }
            catch (err) {
                reject(err);
            }
        });
    };
    Server.prototype.bootstrap = function (routers) {
        var _this = this;
        if (routers === void 0) { routers = []; }
        // se o banco subir OK, sobe as rotas
        return this.initDb().then(function () {
            return _this.initRoutes(routers).then(function () { return _this; });
        });
    };
    return Server;
}());
exports.Server = Server;
