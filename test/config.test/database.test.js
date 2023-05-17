const Sequelize = require('sequelize');
const db = require('../../config/database.js');

jest.mock('sequelize', () => {
	const SequelizeMock = jest.fn(() => ({
		authenticate: jest.fn().mockResolvedValue(true),
		sync: jest.fn().mockResolvedValue(true),
		query: jest.fn().mockResolvedValue(true),
	}));
	return SequelizeMock;
});

describe('Database', () => {
	beforeEach(() => {
		jest.resetModules();
	});

	it('should connect to the database', async () => {
		const isConnected = await db.authenticate();
		expect(isConnected).toBe(true);
		expect(Sequelize).toHaveBeenCalledWith(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			dialect: process.env.DB_DIALECT,
		});
		expect(db.authenticate).toHaveBeenCalled();
	});

	it('should be able to sync the models', async () => {
		await db.sync();
		expect(db.sync).toHaveBeenCalled();
	});

	it('should be able to create a test database in development mode', async () => {
		process.env.NODE_ENV = 'development';
		jest.mock('dotenv', () => ({ config: jest.fn() }));

		const dbName = process.env.DB_NAME.endsWith('_test')
			? process.env.DB_NAME.replace(/_test$/, '')
			: process.env.DB_NAME;

		await db.sync({ alter: true, match: /_test$/ });
		expect(db.query).toHaveBeenCalledWith(`CREATE DATABASE IF NOT EXISTS ${dbName}_test`);
		expect(db.sync).toHaveBeenCalledWith({ alter: true, match: /_test$/ });
	});
});