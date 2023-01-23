const fs = require('fs');

const logRequest = (req) => {
  let logMessage = `${new Date().toUTCString()} - ${req.method} ${req.originalUrl} - ${JSON.stringify(req.body)}\n`;

  fs.appendFile('logs/request.log', logMessage, (err) => {
    if (err) {
      console.error('Error logging to file', err);
    }
  });
};

module.exports = logRequest;