"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const users = [
    { name: 'Nome 1', email: 'nome1@email.com' },
    { name: 'Nome 2', email: 'nome2@email.com' },
    { name: 'Nome 3', email: 'nome3@email.com' }
];
class User {
    static all() {
        return Promise.resolve(users);
    }
}
exports.User = User;
