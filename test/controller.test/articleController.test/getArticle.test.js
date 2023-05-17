const { getArticle } = require('../../../controller/articleController.js');

jest.mock('../../../model/models.js', () => {
	const mockArticle = {
		findByPk: jest.fn(),
	};
	const mockCategory = {
		findOne: jest.fn(),
	};

	return {
		Article: mockArticle,
		Category: mockCategory,
	};
});

const { Article, Category } = require('../../../model/models.js');
const ResourceNotFoundError = require('../../../error/ResourceNotFoundError.js');

const reqMock = {
	params: {
		id: 1,
	},
};

const resMock = {
	status: jest.fn().mockReturnThis(),
	send: jest.fn(),
	json: jest.fn(),
};

describe('getArticle', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('should retrieve and send the article if it exists', async () => {
		const mockArticle = { id: 1, title: 'Article Title' };
		Article.findByPk.mockResolvedValue(mockArticle);

		await getArticle(reqMock, resMock);

		expect(Article.findByPk).toHaveBeenCalledWith(1, { include: Category });
		expect(resMock.status).toHaveBeenCalledWith(200);
		expect(resMock.send).toHaveBeenCalledWith(mockArticle);
		expect(resMock.json).not.toHaveBeenCalled();
	});

	test('should throw ResourceNotFoundError if the article does not exist', async () => {
		Article.findByPk.mockResolvedValue(null);

		await getArticle(reqMock, resMock);

		expect(Article.findByPk).toHaveBeenCalledWith(1, { include: Category });
		expect(resMock.status).toHaveBeenCalledWith(404);
		expect(resMock.json).toHaveBeenCalledWith({ error: 'Article not found' });
		expect(resMock.send).not.toHaveBeenCalled();
	});

	test('should handle errors and return the appropriate response', async () => {
		const error = new Error('Internal server error');
		Article.findByPk.mockImplementation(() => {
			throw error;
		});

		await getArticle(reqMock, resMock);

		expect(Article.findByPk).toHaveBeenCalledWith(1, { include: Category });
		expect(resMock.status).toHaveBeenCalledWith(500);
		expect(resMock.json).toHaveBeenCalledWith({ error: 'Internal server error' });
		expect(resMock.send).not.toHaveBeenCalled();
	});
});