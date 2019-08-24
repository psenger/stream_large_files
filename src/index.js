const express = require('express');
const logger = require('morgan');

const indexRouter = require('./routes');

const index = express();

index.use(logger('dev'));

index.use('/', indexRouter);

module.exports = index;
