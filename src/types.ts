/**
 * IRSMarket SDK - Type Definitions
 */

export interface Authentication {
    apikey: string;
    apisecret?: string;
    sign?: string;
}

export interface TransactionRequest extends Authentication {
    productcode: string;
    trxid: string;
    customerno: string;
    maxprice?: string;
    amount?: number;
}

export interface TransactionResponse {
    success: boolean;
    rc: string;
    reff?: string;
    destination?: string;
    productcode?: string;
    msg?: string;
    status?: string;
    status_message?: string;
    price?: number;
    created_at?: string;
}

export interface BalanceRequest extends Authentication {
}

export interface BalanceResponse {
    success: boolean;
    rc: string;
    msg?: string;
    data?: {
        membername?: string;
        balance?: number | string;
    };
}

export interface ErrorResponse {
    success: false;
    rc: string;
    msg?: string;
}

export type APIResponse = TransactionResponse | BalanceResponse | ErrorResponse;

export interface ClientConfig {
    apikey: string;
    apisecret: string;
    baseURL?: string;
    timeout?: number;
}

export interface TransactionOptions {
    maxprice?: string;
    amount?: number;
}

export class IRSMarketError extends Error {
    constructor(
        message: string,
        public code?: string,
        public response?: any
    ) {
        super(message);
        this.name = 'IRSMarketError';
    }
}
