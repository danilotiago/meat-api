import { User } from './user.model';
import { usersRouter } from './users.router';
import { Server } from './../../server/server';
import { environment } from './../../common/environment';
import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address

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

test('GET /users/aaaa - not found', () => {
    return request(address)
        .get('/users/aaaa')
        .then(resp => {
            // verifica se o status foi 404
            expect(resp.status).toBe(404)
        }).catch(fail)
})

test('PATCH /users/:id', () => {
    return request(address)
        .post('/users')
        .send({
            name: 'Usuário de teste 2',
            email: 'usuariodeteste2@email.com',
            password: '123456'
        })
        .then(resp => {

            return request(address)
                .patch(`/users/${resp.body._id}`)
                .send({
                    name: 'ALTERADO Usuário de teste 2 ALTERADO',
                    email: 'alterado_usuario2@email.com'
                })
                .then(resp => {

                    // verifica se o status foi 200
                    expect(resp.status).toBe(200)

                    // verifica se foi retornado um id
                    expect(resp.body._id).toBeDefined()

                    // verifica se o name foi o name passado
                    expect(resp.body.name).toBe('ALTERADO Usuário de teste 2 ALTERADO')

                    // verifica se o email foi o email passado
                    expect(resp.body.email).toBe('alterado_usuario2@email.com')

                    // verifica se o password nao foi enviado
                    expect(resp.body.password).toBeUndefined()
                })

        
        }).catch(fail)
})