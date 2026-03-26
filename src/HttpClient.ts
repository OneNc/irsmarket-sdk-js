import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ClientConfig, IRSMarketError } from './types';

/**
 * HTTP Client untuk komunikasi dengan IRSMarket API
 */
export class HttpClient {
    private client: AxiosInstance;
    private baseURL: string;

    constructor(config: ClientConfig) {
        this.baseURL = config.baseURL || 'https://api.irsmarket.com/v1';

        this.client = axios.create({
            baseURL: this.baseURL,
            timeout: config.timeout || 30000,
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Add response interceptor untuk error handling
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response) {
                    const { status, data } = error.response;
                    const message = data?.msg || data?.message || error.message;
                    throw new IRSMarketError(
                        message,
                        data?.rc || status.toString(),
                        data
                    );
                } else if (error.request) {
                    throw new IRSMarketError('No response from server');
                } else {
                    throw new IRSMarketError(error.message);
                }
            }
        );
    }

    /**
     * Send POST request
     * @param endpoint - API endpoint
     * @param data - Request data
     * @param config - Additional axios config
     * @returns Response data
     */
    async post(endpoint: string, data: any, config?: AxiosRequestConfig): Promise<any> {
        try {
            const response = await this.client.post(endpoint, data, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Send GET request
     * @param endpoint - API endpoint
     * @param params - Query parameters
     * @param config - Additional axios config
     * @returns Response data
     */
    async get(endpoint: string, params?: any, config?: AxiosRequestConfig): Promise<any> {
        try {
            const response = await this.client.get(endpoint, {
                params,
                ...config
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Get base URL
     * @returns Base URL
     */
    getBaseURL(): string {
        return this.baseURL;
    }
}
