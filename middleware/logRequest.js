const fs = require('fs');
const path = require('path');

const logRequest = (message) => {
	let logMessage = `${new Date().toUTCString()} - ${message}\n`;
	const logsDir = path.join(__dirname, "..", 'logs');

	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir);
	}

	fs.appendFile(path.join(logsDir, 'request.log'), logMessage, (err) => {
		if (err) {
			console.error('Error logging to file', err);
		}
	});
};

module.exports = logRequest;