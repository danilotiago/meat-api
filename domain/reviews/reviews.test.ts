import { Server } from '../../server/server';
import { environment } from '../../common/environment';
import 'jest'
import * as request from 'supertest'

let address: string = (<any>global).address

test('GET /reviews', () => {
    return request('http://localhost:3001')
        .get('/reviews')
        .then(resp => {
            
            // verifica se o status foi 200
            expect(resp.status).toBe(200)

            // verifica se foi retornado um array
            expect(resp.body.items).toBeInstanceOf(Array)

        }).catch(fail)
})