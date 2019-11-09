"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    { id: '1', name: 'Nome 1', email: 'nome1@email.com' },
    { id: '2', name: 'Nome 2', email: 'nome2@email.com' },
    { id: '3', name: 'Nome 3', email: 'nome3@email.com' }
];
class User {
    static all() {
        return Promise.resolve(users);
    }
    static findById(id) {
        return new Promise(resolve => {
            const user = users.find(user => user.id === id);
            resolve(user);
        });
    }
}
exports.User = User;
