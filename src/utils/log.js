// logger.js
const winston = require('winston');

const logger = winston.createLogger({
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: '/tmp/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

const Info = (message) => {
  logger.log('info', message);
};

const Error = (message) => {
  logger.log('error', message);
};

const Debug = (message) => {
  logger.log('debug', message);
};

module.exports = { Info, Error, Debug };
