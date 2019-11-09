import { environment } from './../common/environment';
import * as restify from 'restify';

export class Server {

    application: restify.Server;

    initRoutes(): Promise<any> {
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

                this.application.listen(environment.server.port, () => {
                    resolve(this.application);
                });

            } catch (err) {
                reject(err);
            }
        });
    }

    bootstrap(): Promise<Server> {
        return this.initRoutes()
            .then(() => this);
    }
}