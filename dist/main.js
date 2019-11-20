"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const reviews_router_1 = require("./domain/reviews/reviews.router");
const restaurants_router_1 = require("./domain/restaurants/restaurants.router");
const server_1 = require("./server/server");
const users_router_1 = require("./domain/users/users.router");
const server = new server_1.Server();
server.bootstrap([
    users_router_1.usersRouter,
    restaurants_router_1.restaurantsRouter,
    reviews_router_1.reviewsRouter
])
    .then(server => {
    console.log(`API is running on: `, server.application.address());
}).catch(err => {
    console.log('Server failed to start');
    console.log(err);
    process.exit(1);
});
