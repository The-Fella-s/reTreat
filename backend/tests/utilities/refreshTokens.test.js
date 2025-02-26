// tests/refreshTokens.test.js
jest.mock('axios', () => ({
    get: jest.fn(),
}));

const axios = require('axios');
const { refreshTokensForUser } = require('../../utilities/refreshToken');

describe('Token Refresh Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should refresh tokens successfully', async () => {
        const user = {
            accessToken: 'oldAccessToken',
            instagramId: '123',
            save: jest.fn().mockResolvedValue(),
        };

        // First call: token exchange
        axios.get
            .mockResolvedValueOnce({
                data: {
                    access_token: 'newAccessToken',
                },
            })
            // Second call: fetch connected pages
            .mockResolvedValueOnce({
                data: {
                    data: [
                        { access_token: 'newPageAccessToken' },
                    ],
                },
            });

        await refreshTokensForUser(user);

        expect(user.accessToken).toBe('newAccessToken');
        expect(user.pageAccessToken).toBe('newPageAccessToken');
        expect(user.save).toHaveBeenCalled();
    });

    test('should handle error during token refresh', async () => {
        const user = {
            accessToken: 'oldAccessToken',
            instagramId: '123',
            save: jest.fn().mockResolvedValue(),
        };

        const error = new Error('Token exchange failed');
        axios.get.mockRejectedValue(error);

        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await refreshTokensForUser(user);

        expect(consoleErrorSpy).toHaveBeenCalled();
        consoleErrorSpy.mockRestore();
    });
});
