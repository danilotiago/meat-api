import { User } from './user.model';
import { usersRouter } from './users.router';
import { Server } from './../../server/server';
import { environment } from './../../common/environment';
import 'jest'
import * as request from 'supertest'

/**
 * executa algumas configuracoes antes de 
 * rodar os teste
 * 
 * Aqui, estamos configurando o ambiente de testes
 * 
 */
let server: Server
let address: string
beforeAll(() => {
    environment.db.url = process.env.DB_URL || 'mongodb://localhost/meat-api-tests'
    environment.server.port = process.env.SERVER_PORT || 3001
    address = `http://localhost:${environment.server.port}`
    server = new Server()

    return server.bootstrap([usersRouter])
        .then(() => User.remove({}).exec()) // limpa a collection de users antes de rodar tudo
        .catch(console.error)
})

test('GET /users', () => {
    return request(address)
        .get('/users')
        .then(resp => {
            
            // verifica se o status foi 200
            expect(resp.status).toBe(200)

            // verifica se foi retornado um array
            expect(resp.body.items).toBeInstanceOf(Array)

        }).catch(fail)
})

test('POST /users', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Usuário de teste',
            email: 'usuariodeteste@email.com',
            password: '123456',
            cpf: '12345678909'
        })
        .then(resp => {
            
            // verifica se o status foi 200
            expect(resp.status).toBe(200)

            // verifica se foi retornado um id
            expect(resp.body._id).toBeDefined()

            // verifica se o name foi o name passado
            expect(resp.body.name).toBe('Usuário de teste')

            // verifica se o email foi o email passado
            expect(resp.body.email).toBe('usuariodeteste@email.com')

            // verifica se o cpf foi o cpf passado
            expect(resp.body.cpf).toBe('12345678909')

            // verifica se o password nao foi enviado
            expect(resp.body.password).toBeUndefined()

        }).catch(fail)
})

afterAll(() => {
    return server.shutdown()
})