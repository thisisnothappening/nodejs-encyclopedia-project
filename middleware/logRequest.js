const fs = require('fs');

const logRequest = (message) => {
	let logMessage = `${new Date().toUTCString()} - ${message}\n`;

	fs.appendFile('logs/request.log', logMessage, (err) => {
		if (err) {
			console.error('Error logging to file', err);
		}
	});
};

module.exports = logRequest;