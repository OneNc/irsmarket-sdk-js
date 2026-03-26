# Integration Examples for IRSMarket SDK

Dokumentasi dan contoh terperinci penggunaan IRSMarket SDK.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Express.js Integration](#expressjs-integration)
3. [Transaction Handling](#transaction-handling)
4. [Webhook Processing](#webhook-processing)
5. [Error Handling](#error-handling)
6. [Advanced Scenarios](#advanced-scenarios)

## Basic Usage

### Setup Client

```javascript
import { IRSMarketClient } from 'irsmarket-sdk';

const client = new IRSMarketClient({
  apikey: process.env.IRS_API_KEY,
  apisecret: process.env.IRS_API_SECRET
});
```

### Simple Transaction

```javascript
async function buyPulsa() {
  try {
    const response = await client.transaction(
      'TSEL_50000',           // Telkomsel 50rb
      'TRX_' + Date.now(),    // Unique ID
      '081234567890'          // Phone number
    );

    if (response.success) {
      console.log('✅ Transaksi berhasil!');
      console.log('Ref:', response.reff);
      console.log('Status:', response.msg);
    }
  } catch (error) {
    console.error('❌ Transaksi gagal:', error.message);
  }
}
```

### Check Balance

```javascript
async function showBalance() {
  const balance = await client.getBalance();
  
  if (balance.success) {
    console.log(`Your balance: Rp ${balance.data?.balance}`);
  }
}
```

## Express.js Integration

### Complete Server Setup

```javascript
import express from 'express';
import { IRSMarketClient, WebhookHandler, createWebhookMiddleware } from 'irsmarket-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize IRSMarket Client
const client = new IRSMarketClient({
  apikey: process.env.IRS_API_KEY!,
  apisecret: process.env.IRS_API_SECRET!
});

// Initialize Webhook Handler
const webhookHandler = new WebhookHandler();

// =============== WEBHOOK HANDLERS ===============

webhookHandler.on('Sukses', async (payload) => {
  console.log('✅ Transaction Success:', {
    ref: payload.reff,
    destination: payload.tujuan,
    serialNumber: payload.sn,
    newBalance: payload.saldo
  });

  // Update database
  await updateTransactionStatus(payload.reff, 'SUCCESS');
  
  // Send email notification
  await sendSuccessEmail(payload.tujuan);
  
  // Update user balance
  await updateUserBalance(payload.reff, payload.saldo);
});

webhookHandler.on('Gagal', async (payload) => {
  console.log('❌ Transaction Failed:', {
    ref: payload.reff,
    errorCode: payload.rc,
    destination: payload.tujuan
  });

  await updateTransactionStatus(payload.reff, 'FAILED');
  await notifyFailure(payload.reff);
});

webhookHandler.on('Pending', async (payload) => {
  console.log('⏳ Transaction Pending:', payload.reff);
  await updateTransactionStatus(payload.reff, 'PENDING');
});

// =============== REST ENDPOINTS ===============

// Get balance
app.get('/api/balance', async (req, res) => {
  try {
    const balance = await client.getBalance();
    res.json(balance);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Create transaction
app.post('/api/transaction', async (req, res) => {
  try {
    const { product, phone, maxprice, amount } = req.body;

    // Validation
    if (!product || !phone) {
      return res.status(400).json({ 
        error: 'Product and phone are required' 
      });
    }

    // Create transaction
    const response = await client.transaction(
      product,
      `TRX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      phone,
      { maxprice, amount }
    );

    res.json(response);
  } catch (error: any) {
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
});

// Webhook endpoint
app.post('/webhook/irsmarket', createWebhookMiddleware(webhookHandler));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler
app.use((err: any, req: any, res: any, next: any) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Webhook URL: http://localhost:${PORT}/webhook/irsmarket`);
});
```

## Transaction Handling

### Product Code Reference

```javascript
const PRODUCTS = {
  // Telkomsel
  TSEL_5000: 'Telkomsel 5rb',
  TSEL_10000: 'Telkomsel 10rb',
  TSEL_20000: 'Telkomsel 20rb',
  TSEL_50000: 'Telkomsel 50rb',
  
  // XL Axiata
  XL_5000: 'XL 5rb',
  XL_10000: 'XL 10rb',
  
  // Indosat
  IM3_5000: 'Indosat 5rb',
  IM3_10000: 'Indosat 10rb',
  
  // Tri
  TREE_5000: 'Tri 5rb',
  TREE_10000: 'Tri 10rb',
  
  // Smart
  SMART_5000: 'Smart 5rb',
  SMART_10000: 'Smart 10rb'
};
```

### Transaction with Error Handling

```javascript
async function safeTransaction(product, phone, maxprice) {
  try {
    // Validate inputs
    if (!product) throw new Error('Product code required');
    if (!phone) throw new Error('Phone number required');
    if (!phone.match(/^\d{10,13}$/)) throw new Error('Invalid phone format');

    // Generate unique transaction ID
    const trxId = `TRX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Perform transaction
    const response = await client.transaction(
      product,
      trxId,
      phone,
      { maxprice }
    );

    if (!response.success) {
      throw new Error(`Transaction failed: ${response.msg}`);
    }

    return {
      success: true,
      refId: response.reff,
      trxId: trxId,
      status: response.rc
    };

  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      code: error.code
    };
  }
}
```

### Batch Transactions

```javascript
async function batchTransactions(transactions) {
  const results = [];

  for (const txn of transactions) {
    try {
      const response = await client.transaction(
        txn.product,
        `TRX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        txn.phone,
        txn.options
      );

      results.push({
        phone: txn.phone,
        success: response.success,
        ref: response.reff
      });
    } catch (error: any) {
      results.push({
        phone: txn.phone,
        success: false,
        error: error.message
      });
    }

    // Delay antara requests untuk avoid rate limit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}
```

## Webhook Processing

### Setup with Signal/Event Emitter

```javascript
import EventEmitter from 'events';

class TransactionManager extends EventEmitter {
  private client: IRSMarketClient;
  private webhookHandler: WebhookHandler;

  constructor(config: any) {
    super();
    this.client = new IRSMarketClient(config);
    this.webhookHandler = new WebhookHandler();
    this.setupHandlers();
  }

  private setupHandlers() {
    this.webhookHandler.on('Sukses', async (payload) => {
      this.emit('success', payload);
    });

    this.webhookHandler.on('Gagal', async (payload) => {
      this.emit('failed', payload);
    });

    this.webhookHandler.on('Pending', async (payload) => {
      this.emit('pending', payload);
    });
  }

  async processWebhook(payload: any) {
    return this.webhookHandler.process(payload);
  }
}

// Usage
const txnManager = new TransactionManager(config);

txnManager.on('success', (payload) => {
  console.log('Success:', payload);
});

txnManager.on('failed', (payload) => {
  console.log('Failed:', payload);
});
```

## Error Handling

### Detailed Error Handling

```javascript
import { IRSMarketError, IRSMarketClient } from 'irsmarket-sdk';

async function handleTransaction() {
  try {
    const response = await client.transaction(
      'TSEL_5000',
      'TRX_001',
      '081234567890'
    );

  } catch (error) {
    if (error instanceof IRSMarketError) {
      const code = error.code;
      const description = IRSMarketClient.getResponseCodeDescription(code);

      switch (code) {
        case '61':
          console.log('❌ Saldo tidak cukup!');
          // Show balance and suggest adding funds
          const balance = await client.getBalance();
          console.log('Current balance:', balance.data?.balance);
          break;

        case '40':
        case '41':
          console.log('❌ Produk tidak tersedia atau tidak aktif');
          break;

        case '62':
          console.log('❌ Transaksi dengan ID ini sudah ada');
          break;

        case '11':
        case '12':
          console.log('❌ Kredensial API tidak valid');
          break;

        default:
          console.log(`❌ Error: ${description}`);
      }

      console.error('Error Details:', {
        code: error.code,
        message: error.message,
        response: error.response
      });
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

## Advanced Scenarios

### Retry with Exponential Backoff

```javascript
async function transactionWithRetry(
  product: string,
  phone: string,
  maxRetries: number = 3,
  initialDelay: number = 1000
) {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt + 1} of ${maxRetries}`);
      
      return await client.transaction(
        product,
        `TRX_${Date.now()}`,
        phone
      );
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
```

### Transaction Caching

```javascript
class CachedTransactionClient {
  private cache: Map<string, any> = new Map();
  private client: IRSMarketClient;
  private cacheExpiry: number = 300000; // 5 minutes

  constructor(config: any) {
    this.client = new IRSMarketClient(config);
  }

  async getBalance() {
    const cacheKey = 'balance';
    
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    const balance = await this.client.getBalance();
    this.cache.set(cacheKey, {
      data: balance,
      timestamp: Date.now()
    });

    return balance;
  }

  clearCache() {
    this.cache.clear();
  }
}
```

### Logging & Monitoring

```javascript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true
    }
  }
});

class MonitoredClient {
  private client: IRSMarketClient;

  constructor(config: any) {
    this.client = new IRSMarketClient(config);
  }

  async transaction(product: string, trxId: string, phone: string) {
    const startTime = Date.now();

    try {
      logger.info({ product, phone }, 'Starting transaction');
      
      const response = await this.client.transaction(
        product,
        trxId,
        phone
      );

      const duration = Date.now() - startTime;
      logger.info(
        { product, phone, rc: response.rc, duration },
        'Transaction completed'
      );

      return response;
    } catch (error: any) {
      const duration = Date.now() - startTime;
      logger.error(
        { product, phone, error: error.message, duration },
        'Transaction failed'
      );

      throw error;
    }
  }
}
```

---

Untuk lebih banyak contoh dan dokumentasi lengkap, kunjungi [README](README.md).
