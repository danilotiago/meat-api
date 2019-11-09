import { User } from './../dist/users/user.model';
import { Router } from "../common/router";
import * as restify from 'restify';

class UsersRouter extends Router {
    
    applyRoutes(application: restify.Server) {
        
        application.get('/users', (req, resp, next) => {
            User.all()
                .then(users => {
                    resp.json(users);
                    return next();
                });
        });
    }
}

export const usersRouter = new UsersRouter();