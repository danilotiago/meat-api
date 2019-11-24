import * as jestCli from 'jest-cli'

import { Review } from './domain/reviews/review.model';
import { reviewsRouter } from './domain/reviews/reviews.router';
import { environment } from "./common/environment"
import { User } from "./domain/users/user.model"
import { usersRouter } from "./domain/users/users.router"
import { Server } from "./server/server"

let server: Server
const beforeAllTests = () => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-tests'
    environment.server.port = process.env.SERVER_PORT || 3001
    const address = `http://localhost:${environment.server.port}`
    server = new Server()

    return server.bootstrap([
            usersRouter,
            reviewsRouter
        ])
        .then(() => User.remove({}).exec()) // limpa a collection de users antes de rodar tudo
        .then(() => Review.remove({}).exec()) // limpa a collection de reviews antes de rodar tudo
}

const afterAllTests = () => {
    return server.shutdown()
}

/**
 * [startup]
 * chama ordenadamente a execucao dos testes
 * 
 */
 beforeAllTests() // chama a criacao do server
    .then(() => jestCli.run()) // executa os testes manualmente
    .then(() => afterAllTests()) // chama o encerramento dos testes
    .catch(console.error)