import { environment } from './../common/environment';
import * as restify from 'restify';
import { Router } from '../common/router';

export class Server {

    application: restify.Server;

    initRoutes(routers: Router[]): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                this.application = restify.createServer({
                    name: 'meat-api',
                    version: '1.0.0'
                });

                // loop para inicializar as rotas
                routers.forEach(route => route.applyRoutes(this.application));

                this.application.use(restify.plugins.queryParser());

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

            } catch (err) {
                reject(err);
            }
        });
    }

    bootstrap(routers: Router[] = []): Promise<Server> {
        return this.initRoutes(routers)
            .then(() => this);
    }
}