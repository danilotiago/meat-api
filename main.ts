import { restaurantsRouter } from './domain/restaurants/restaurants.router';
import { Server } from './server/server';
import { usersRouter } from './domain/users/users.router';

const server = new Server();

server.bootstrap([
        usersRouter, 
        restaurantsRouter
    ])
    .then(server => {
        console.log(`API is running on: `, server.application.address());
    }).catch(err => {
        console.log('Server failed to start');
        console.log(err);
        process.exit(1);
    });