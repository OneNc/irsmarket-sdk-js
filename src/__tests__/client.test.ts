import { IRSMarketClient, IRSMarketError, generateSignature } from '../index';

// Manual mock for axios
jest.mock('axios', () => ({
    create: jest.fn(() => ({
        post: jest.fn(),
        get: jest.fn(),
        interceptors: {
            response: {
                use: jest.fn()
            }
        }
    }))
}));

describe('IRSMarketClient', () => {
    let client: IRSMarketClient;
    const mockConfig = {
        apikey: 'test_api_key',
        apisecret: 'test_api_secret'
    };

    beforeEach(() => {
        jest.clearAllMocks();
        client = new IRSMarketClient(mockConfig);
    });

    describe('Initialization', () => {
        it('should initialize with valid config', () => {
            expect(client).toBeDefined();
        });

        it('should throw error on missing apikey', () => {
            expect(() => {
                new IRSMarketClient({
                    apikey: '',
                    apisecret: 'secret'
                } as any);
            }).toThrow();
        });
    });

    describe('Response Code', () => {
        it('should return description for valid code', () => {
            const desc = IRSMarketClient.getResponseCodeDescription('00');
            expect(desc).toBe('Success');
        });

        it('should return description for code 68', () => {
            const desc = IRSMarketClient.getResponseCodeDescription('68');
            expect(desc).toContain('Pending');
        });

        it('should return description for code 61', () => {
            const desc = IRSMarketClient.getResponseCodeDescription('61');
            expect(desc).toBe('Insufficient Balance');
        });

        it('should return description for code 11', () => {
            const desc = IRSMarketClient.getResponseCodeDescription('11');
            expect(desc).toBe('Invalid API Key');
        });

        it('should handle unknown code', () => {
            const desc = IRSMarketClient.getResponseCodeDescription('999');
            expect(desc).toContain('Unknown');
        });
    });

    describe('Input Validation', () => {
        it('should throw error when productcode is empty', async () => {
            await expect(
                client.transaction('', 'TRX_001', '08123456789')
            ).rejects.toThrow();
        });

        it('should throw error when trxid is empty', async () => {
            await expect(
                client.transaction('TSEL_5000', '', '08123456789')
            ).rejects.toThrow();
        });

        it('should throw error when customerno is empty', async () => {
            await expect(
                client.transaction('TSEL_5000', 'TRX_001', '')
            ).rejects.toThrow();
        });
    });
});

describe('Utilities', () => {
    describe('generateSignature', () => {
        it('should generate valid MD5 signature', () => {
            const signature = generateSignature(
                'test_key',
                'test_secret',
                'TRX_001'
            );

            // MD5 hashes are 32 hex characters
            expect(signature).toMatch(/^[a-f0-9]{32}$/i);
        });

        it('should generate same signature for same inputs', () => {
            const sig1 = generateSignature('key', 'secret', 'txn');
            const sig2 = generateSignature('key', 'secret', 'txn');

            expect(sig1).toBe(sig2);
        });

        it('should generate different signature for different inputs', () => {
            const sig1 = generateSignature('key', 'secret', 'txn1');
            const sig2 = generateSignature('key', 'secret', 'txn2');

            expect(sig1).not.toBe(sig2);
        });
    });
});
