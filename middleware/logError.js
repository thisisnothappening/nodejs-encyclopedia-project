const fs = require('fs');

const logError = (err) => {
	let logMessage = `${new Date().toUTCString()} - ${err.name}: ${err.message}\n`;

	fs.appendFile('logs/error.log', logMessage, (err) => {
		if (err) {
			console.error('Error logging to file', err);
		}
	});
};

module.exports = logError;
