import { Server } from './server/server';

const server = new Server();

server.bootstrap()
    .then(server => {
        console.log(`API is running on: `, server.application.address());
    }).catch(err => {
        console.log('Server failed to start');
        console.log(err);
        process.exit(1);
    });