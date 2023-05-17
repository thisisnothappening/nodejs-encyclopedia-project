const { Op } = require('sequelize');
const { getAllArticles } = require('../../../controller/articleController');

jest.mock('../../../model/models', () => {
	const mockCategory = { findOne: jest.fn(), id: 1 };
	const mockArticle = { findAll: jest.fn() };

	return {
		Category: mockCategory,
		Article: mockArticle,
	};
});

const { Category, Article } = require('../../../model/models');

const reqMock = {
	query: {
		name: 'article name',
		category: 'category name',
	},
};

const resMock = {
	status: jest.fn().mockReturnThis(),
	send: jest.fn(),
	json: jest.fn(),
};

describe('getAllArticles', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should retrieve articles with the given name and category', async () => {
		const findOneMock = jest.spyOn(Category, 'findOne').mockResolvedValue({ id: 1 });
		const findAllMock = jest.spyOn(Article, 'findAll').mockResolvedValue([{ id: 1, name: 'article name' }]);

		await getAllArticles(reqMock, resMock);

		expect(findOneMock).toHaveBeenCalledWith({ where: { name: 'category name' } });
		expect(findAllMock).toHaveBeenCalledWith({
			include: Category,
			where: {
				name: { [Op.substring]: 'article name' },
				categoryId: 1,
			},
		});
		expect(resMock.status).toHaveBeenCalledWith(200);
		expect(resMock.send).toHaveBeenCalledWith([{ id: 1, name: 'article name' }]);
		expect(resMock.json).not.toHaveBeenCalled();
	});

	test('should retrieve articles with the given name only when category is not provided', async () => {
		const findOneMock = jest.spyOn(Category, 'findOne').mockResolvedValue(null);
		const findAllMock = jest.spyOn(Article, 'findAll').mockResolvedValue([{ id: 2, name: 'article name 2' }]);

		reqMock.query.category = undefined;

		await getAllArticles(reqMock, resMock);

		expect(findOneMock).toHaveBeenCalledWith({ where: { name: '' } });
		expect(findAllMock).toHaveBeenCalledWith({
			include: Category,
			where: {
				name: { [Op.substring]: 'article name' },
			},
		});
		expect(resMock.status).toHaveBeenCalledWith(200);
		expect(resMock.send).toHaveBeenCalledWith([{ id: 2, name: 'article name 2' }]);
		expect(resMock.json).not.toHaveBeenCalled();
	});

	test('should handle errors and return the appropriate response', async () => {
		const error = new Error('Internal server error');
		const findOneMock = jest.spyOn(Category, 'findOne').mockRejectedValue(error);

		await getAllArticles(reqMock, resMock);

		expect(findOneMock).toHaveBeenCalledWith({ where: { name: '' } });
		expect(resMock.status).toHaveBeenCalledWith(500);
		expect(resMock.json).toHaveBeenCalledWith({ error: 'Internal server error' });
		expect(resMock.send).not.toHaveBeenCalled();
	});
});