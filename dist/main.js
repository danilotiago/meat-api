"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server/server");
const server = new server_1.Server();
server.bootstrap()
    .then(server => {
    console.log(`API is running on: `, server.application.address());
}).catch(err => {
    console.log('Server failed to start');
    console.log(err);
    process.exit(1);
});
