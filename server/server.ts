import { mergePatchBodyParser } from './../dist/server/merge-path.parser';
import { environment } from './../common/environment';
import * as restify from 'restify';
import { Router } from '../common/router';
import * as mongoose from 'mongoose';

export class Server {

    application: restify.Server;

    initDb(): Promise<mongoose.Mongoose> {
        return mongoose.connect(environment.db.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
    
    initRoutes(routers: Router[]): Promise<any> {
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
                // parse do Body da requisicao via merge-patch+json
                this.application.use(mergePatchBodyParser);

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

            } catch (err) {
                reject(err);
            }
        });
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        // se o banco subir OK, sobe as rotas
        return this.initDb().then(() =>
            this.initRoutes(routers).then(() => this)
        );
    }
}