const winston = require("winston");
const { NODE_ENV } = require("./config");

function errorHandler(error, req, res, next) {
  let response = "";

  // set up winston
  const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [new winston.transports.File({ filename: "info.log" })],
  });

  if (NODE_ENV === "production") {
    logger.add(
      new winston.transports.Console({
        format: winston.format.simple(),
      })
    );
  } else {
    response = { error };
  }
  res.status(500).json(response);
}

module.exports = errorHandler;
