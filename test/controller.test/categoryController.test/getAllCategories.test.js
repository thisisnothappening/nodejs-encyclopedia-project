const { getAllCategories } = require('../../../controller/categoryController.js');

jest.mock('../../../model/models.js', () => {
	const mockCategory = { findAll: jest.fn() };

	return {
		Category: mockCategory,
	};
});

const { Category } = require('../../../model/models.js');

describe('getAllCategories', () => {
	it('should return all categories', async () => {
		Category.findAll = jest.fn().mockReturnValue(['category1', 'category2']);

		const req = {};
		const res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
			json: jest.fn()
		};

		await getAllCategories(req, res);

		expect(Category.findAll).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.send).toHaveBeenCalledWith(['category1', 'category2']);
		expect(res.json).not.toHaveBeenCalled();
	});

	it('should return an error response if there is an error while fetching categories', async () => {
		Category.findAll = jest.fn().mockImplementation(() => {
			throw new Error('Database connection failed');
		});

		const req = {};
		const res = {
			status: jest.fn().mockReturnThis(),
			send: jest.fn(),
			json: jest.fn()
		};

		await getAllCategories(req, res);

		expect(Category.findAll).toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ error: 'Database connection failed' });
		expect(res.send).not.toHaveBeenCalled();
	});
});