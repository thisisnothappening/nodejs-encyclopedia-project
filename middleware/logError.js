const fs = require('fs');
const path = require('path');

const logError = (err) => {
	let logMessage = `${new Date().toUTCString()} - ${err.name}: ${err.message}\n`;
	const logsDir = path.join(__dirname, 'logs');

	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir);
	}

	fs.appendFile(path.join(logsDir, 'error.log'), logMessage, (err) => {
		if (err) {
			console.error('Error logging to file', err);
		}
	});
};

module.exports = logError;
