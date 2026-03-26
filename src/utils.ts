import crypto from 'crypto';

/**
 * Generate MD5 signature for API request
 * @param apikey - API Key
 * @param apisecret - API Secret
 * @param trxid - Transaction ID
 * @returns MD5 hash
 */
export function generateSignature(apikey: string, apisecret: string, trxid: string): string {
    const data = apikey + apisecret + trxid;
    return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * Validate required fields in request
 * @param data - Data object to validate
 * @param fields - Required field names
 * @throws Error if any required field is missing
 */
export function validateRequired(data: any, fields: string[]): void {
    for (const field of fields) {
        if (!data[field]) {
            throw new Error(`Field '${field}' is required`);
        }
    }
}

/**
 * Validate MD5 hash format
 * @param signature - Signature to validate
 * @returns true if valid MD5 format
 */
export function isValidMD5(signature: string): boolean {
    return /^[a-f0-9]{32}$/.test(signature.toLowerCase());
}

/**
 * Format currency to IDR
 * @param amount - Amount in number
 * @returns Formatted currency string
 */
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
    }).format(amount);
}
