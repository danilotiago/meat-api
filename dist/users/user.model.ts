const users = [
    {name: 'Nome 1', email: 'nome1@email.com'},
    {name: 'Nome 2', email: 'nome2@email.com'},
    {name: 'Nome 3', email: 'nome3@email.com'}
];

export class User {
    static all(): Promise<any> {
        return Promise.resolve(users);
    }
}

