import "dotenv/config";

jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashedPassword123'),
    compare: jest.fn().mockResolvedValue(true),
}));

jest.setTimeout(10000);

afterEach(() => {
    jest.clearAllMocks();
});