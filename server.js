const express = require('express');
const configMiddleware = require('./config/middleware')

const zoosRouter = require('./zoos/zoos-router');
const bearsRouter = require('./bears/bears-router');

const server = express();

configMiddleware(server);

server.use('/api/zoos', zoosRouter);
server.use('/api/bears', bearsRouter);

module.exports = server;