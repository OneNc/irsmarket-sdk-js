/**
 * Example usage of IRSMarket SDK
 */

import { IRSMarketClient, generateSignature } from './index';

// ============================================
// EXAMPLE 1: Initialize Client
// ============================================
const client = new IRSMarketClient({
    apikey: 'LxxRtdiqlELnvkZonaYD',
    apisecret: 'JWW6UBSBz9sbGLiiHgzz',
    baseURL: 'https://api.irsmarket.com/v1',
    timeout: 30000
});

// ============================================
// EXAMPLE 2: Perform Transaction
// ============================================
async function performTransaction() {
    try {
        const response = await client.transaction(
            'TSEL_5000',                    // Product code
            'TRX_001_20250104_001',         // Transaction ID
            '081234567890',                 // Customer number
            {
                maxprice: '5500',             // Optional: max price
                amount: undefined             // Optional: amount for open denom
            }
        );

        console.log('Transaction Response:', response);

        // Check response code
        const description = IRSMarketClient.getResponseCodeDescription(response.rc);
        console.log(`Status Code: ${response.rc} - ${description}`);

    } catch (error: any) {
        console.error('Transaction Error:', error.message);
        console.error('Error Code:', error.code);
    }
}

// ============================================
// EXAMPLE 3: Get Balance
// ============================================
async function checkBalance() {
    try {
        const balance = await client.getBalance();

        if (balance.success) {
            console.log('Member:', balance.data?.membername);
            console.log('Balance:', balance.data?.balance);
        } else {
            console.log('Error:', balance.msg);
        }
    } catch (error: any) {
        console.error('Balance Error:', error.message);
    }
}

// ============================================
// EXAMPLE 4: Generate Signature (Alternative Auth)
// ============================================
function signatureExample() {
    const apikey = 'your_api_key';
    const apisecret = 'your_api_secret';
    const trxid = 'TRX_001_20250104_001';

    const signature = generateSignature(apikey, apisecret, trxid);
    console.log('Generated Signature:', signature);

    // Kemudian gunakan signature ini dalam request body
    // Alih-alih apisecret, gunakan field 'sign' dengan value signature
}

// ============================================
// Run Examples (uncomment to run)
// ============================================
// performTransaction();
checkBalance();
// signatureExample();
