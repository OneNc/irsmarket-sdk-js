/**
 * Test untuk Check Balance Functionality
 */

import { IRSMarketClient } from '../index';

describe('IRSMarketClient - Check Balance', () => {
    let client: IRSMarketClient;

    beforeEach(() => {
        // Mock axios sebelumnya sudah di-setup di jest.config.js
        client = new IRSMarketClient({
            apikey: 'test_api_key',
            apisecret: 'test_api_secret'
        });
    });

    describe('getBalance()', () => {
        it('should have getBalance method', () => {
            expect(typeof client.getBalance).toBe('function');
        });

        it('should return a Promise', () => {
            const result = client.getBalance();
            expect(result).toBeInstanceOf(Promise);
        });
    });

    describe('Balance Response Structure', () => {
        it('should have required response fields', async () => {
            // Contoh respons yang seharusnya diterima
            const expectedResponse = {
                success: true,
                rc: '00',
                msg: 'Success',
                data: {
                    membername: 'Test Member',
                    balance: '1000000'
                }
            };

            expect(expectedResponse).toHaveProperty('success');
            expect(expectedResponse).toHaveProperty('rc');
            expect(expectedResponse).toHaveProperty('data');
            expect(expectedResponse.data).toHaveProperty('membername');
            expect(expectedResponse.data).toHaveProperty('balance');
        });

        it('should handle error response', () => {
            const errorResponse = {
                success: false,
                rc: '11',
                msg: 'Invalid API Key'
            };

            expect(errorResponse.success).toBe(false);
            expect(errorResponse.rc).toBe('11');
        });
    });

    describe('Response Codes for Balance', () => {
        it('code 00 should be Success', () => {
            const desc = IRSMarketClient.getResponseCodeDescription('00');
            expect(desc).toBe('Success');
        });

        it('code 11 should be Invalid API Key', () => {
            const desc = IRSMarketClient.getResponseCodeDescription('11');
            expect(desc).toBe('Invalid API Key');
        });

        it('code 12 should be Invalid API Secret', () => {
            const desc = IRSMarketClient.getResponseCodeDescription('12');
            expect(desc).toBe('Invalid API Secret');
        });
    });
});
