const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');

const zoosRouter = require('./zoos/zoos-router');

const server = express();

server.use(morgan('dev'));
server.use(helmet());
server.use(express.json());

server.use('/api/zoos', zoosRouter);

module.exports = server;