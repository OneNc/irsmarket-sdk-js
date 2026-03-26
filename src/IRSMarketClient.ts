import { HttpClient } from './HttpClient';
import {
    ClientConfig,
    TransactionRequest,
    TransactionResponse,
    BalanceRequest,
    BalanceResponse,
    TransactionOptions,
    IRSMarketError
} from './types';
import { generateSignature, validateRequired } from './utils';

/**
 * Main client untuk IRSMarket API Integration
 * Supports: Transaksi, Cek Saldo, Webhook Handling
 */
export class IRSMarketClient {
    private http: HttpClient;
    private apikey: string;
    private apisecret: string;

    constructor(config: ClientConfig) {
        validateRequired(config, ['apikey', 'apisecret']);

        this.apikey = config.apikey;
        this.apisecret = config.apisecret;
        this.http = new HttpClient(config);
    }

    /**
     * Perform transaction (POST method)
     * @param productcode - Product code (e.g., TSEL_5000, XL_10000)
     * @param trxid - Unique transaction ID
     * @param customerno - Customer number (HP/Meter/ID)
     * @param options - Optional parameters (maxprice, amount)
     * @returns Transaction response
     */
    async transaction(
        productcode: string,
        trxid: string,
        customerno: string,
        options?: TransactionOptions
    ): Promise<TransactionResponse> {
        validateRequired({ productcode, trxid, customerno }, [
            'productcode',
            'trxid',
            'customerno'
        ]);

        const payload: TransactionRequest = {
            apikey: this.apikey,
            apisecret: this.apisecret,
            productcode,
            trxid,
            customerno,
            ...(options?.maxprice && { maxprice: options.maxprice }),
            ...(options?.amount && { amount: options.amount })
        };

        try {
            const response = await this.http.post('/transaction', payload);
            return this.validateResponse(response) as TransactionResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Perform transaction (GET method)
     * Useful for webhooks atau callback scenarios
     * @param productcode - Product code
     * @param trxid - Transaction ID
     * @param customerno - Customer number
     * @param maxprice - Maximum price (optional)
     * @returns Transaction response
     */
    async transactionByGet(
        productcode: string,
        trxid: string,
        customerno: string,
        maxprice?: string
    ): Promise<TransactionResponse> {
        validateRequired({ productcode, trxid, customerno }, [
            'productcode',
            'trxid',
            'customerno'
        ]);

        const params: any = {
            apikey: this.apikey,
            apisecret: this.apisecret,
            productcode,
            trxid,
            customerno
        };

        if (maxprice) {
            params.maxprice = maxprice;
        }

        try {
            const response = await this.http.get('/transaction', params);
            return this.validateResponse(response) as TransactionResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Check account balance
     * @returns Balance information
     */
    async getBalance(): Promise<BalanceResponse> {
        const payload: BalanceRequest = {
            apikey: this.apikey,
            apisecret: this.apisecret
        };

        try {
            const response = await this.http.post('/balance', payload);
            return this.validateResponse(response) as BalanceResponse;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    /**
     * Get response code description (reference)
     * @param code - Response code
     * @returns Description of response code
     */
    static getResponseCodeDescription(code: string): string {
        const descriptions: { [key: string]: string } = {
            '00': 'Success',
            '11': 'Invalid API Key',
            '12': 'Invalid API Secret',
            '13': 'Invalid IP Address',
            '40': 'Product Not Found',
            '41': 'Product Not Active',
            '42': 'Mapping Product Not Found',
            '43': 'Product Supplier Not Found',
            '61': 'Insufficient Balance',
            '62': 'Transaction Already Exists',
            '63': 'Supplier Not Active',
            '64': 'Transaction Processing Error',
            '66': 'Product Supplier Not Active',
            '67': 'Max Price Exceeded',
            '68': 'Pending - Transaksi sedang diproses',
            '69': 'No Seller Selling This Product',
            '70': 'No Seller Selling This Product In Region',
            '71': 'Invalid Amount',
            '72': 'Invalid Signature'
        };

        return descriptions[code] || 'Unknown code: ' + code;
    }

    /**
     * Validate API response
     * @private
     */
    private validateResponse(response: any): any {
        if (!response) {
            throw new IRSMarketError('Empty response from server');
        }

        if (response.success === false) {
            throw new IRSMarketError(
                response.msg || 'Transaction failed',
                response.rc,
                response
            );
        }

        return response;
    }

    /**
     * Handle errors
     * @private
     */
    private handleError(error: any): IRSMarketError {
        if (error instanceof IRSMarketError) {
            return error;
        }

        return new IRSMarketError(
            error.message || 'Unknown error occurred',
            error.code,
            error.response
        );
    }
}
