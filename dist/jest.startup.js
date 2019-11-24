"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jestCli = require("jest-cli");
const review_model_1 = require("./domain/reviews/review.model");
const reviews_router_1 = require("./domain/reviews/reviews.router");
const environment_1 = require("./common/environment");
const user_model_1 = require("./domain/users/user.model");
const users_router_1 = require("./domain/users/users.router");
const server_1 = require("./server/server");
let server;
const beforeAllTests = () => {
    environment_1.environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-tests';
    environment_1.environment.server.port = process.env.SERVER_PORT || 3001;
    const address = `http://localhost:${environment_1.environment.server.port}`;
    server = new server_1.Server();
    return server.bootstrap([
        users_router_1.usersRouter,
        reviews_router_1.reviewsRouter
    ])
        .then(() => user_model_1.User.remove({}).exec()) // limpa a collection de users antes de rodar tudo
        .then(() => review_model_1.Review.remove({}).exec()); // limpa a collection de reviews antes de rodar tudo
};
const afterAllTests = () => {
    return server.shutdown();
};
/**
 * [startup]
 * chama ordenadamente a execucao dos testes
 *
 */
beforeAllTests() // chama a criacao do server
    .then(() => jestCli.run()) // executa os testes manualmente
    .then(() => afterAllTests()) // chama o encerramento dos testes
    .catch(console.error);
