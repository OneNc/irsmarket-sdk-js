# IRSMarket SDK

[![npm version](https://badge.fury.io/js/irsmarket-sdk-js.svg)](https://badge.fury.io/js/irsmarket-sdk-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Node.js SDK untuk integrasi API **IRSMarket** - Platform jual beli pulsa, kuota data, voucher game, e-money, PPOB, dan produk digital lainnya.

## 🚀 Features

- ✅ **Transaction Management** - Lakukan transaksi pembelian produk digital
- ✅ **Balance Checking** - Cek saldo akun Anda
- ✅ **Webhook Handling** - Terima dan proses notifikasi transaksi otomatis
- ✅ **Error Handling** - Error handling yang komprehensif
- ✅ **Type Safety** - Full TypeScript support dengan type definitions
- ✅ **Multiple Auth Methods** - Support API Secret maupun MD5 Signature
- ✅ **Express Middleware** - Middleware siap pakai untuk Express.js

## 📦 Installation

```bash
npm install irsmarket-sdk-js
```

atau dengan yarn:

```bash
yarn add irsmarket-sdk-js
```

## 🔑 Quick Start

### 1. Setup Environment Variables

Create `.env` file di root project:

```bash
# .env
IRS_API_KEY=your_api_key_here
IRS_API_SECRET=your_api_secret_here
```

### 2. Initialize Client

```javascript
import * as dotenv from 'dotenv';
dotenv.config();

import { IRSMarketClient } from 'irsmarket-sdk-js';

const client = new IRSMarketClient({
  apikey: process.env.IRS_API_KEY!,
  apisecret: process.env.IRS_API_SECRET!,
  baseURL: 'https://api.irsmarket.com/v1', // Optional
  timeout: 30000 // Optional
});
```

**Or hardcoded (NOT recommended for production):**

```javascript
import { IRSMarketClient } from 'irsmarket-sdk-js';

const client = new IRSMarketClient({
  apikey: 'your_api_key_here',
  apisecret: 'your_api_secret_here',
  baseURL: 'https://api.irsmarket.com/v1', // Optional
  timeout: 30000 // Optional
});
```

### 3. Perform Transaction

```javascript
try {
  const response = await client.transaction(
    'TSEL_5000',            // Product code
    'TRX_001_20250104_001', // Transaction ID (unique)
    '081234567890',         // Customer number
    {
      maxprice: '5500',     // Optional: max price
      amount: undefined     // Optional: for open denom
    }
  );

  console.log('Response:', response);
  // Output: { success: true, rc: '00', reff: '...', ... }
  
} catch (error) {
  console.error('Error:', error.message);
}
```

### 4. Check Balance

```javascript
const balance = await client.getBalance();

if (balance.success) {
  console.log('Member:', balance.data?.membername);
  console.log('Balance:', balance.data?.balance);
}
```

### 5. Handle Webhooks

```javascript
import { WebhookHandler, createWebhookMiddleware } from 'irsmarket-sdk-js';
import express from 'express';

const app = express();
app.use(express.json());

const webhookHandler = new WebhookHandler();

// Register handlers for different statuses
webhookHandler.on('Sukses', async (payload) => {
  console.log('✅ Transaction successful:', payload);
  // Update database, send notification, etc
});

webhookHandler.on('Gagal', async (payload) => {
  console.log('❌ Transaction failed:', payload);
});

webhookHandler.on('Pending', async (payload) => {
  console.log('⏳ Transaction pending:', payload);
});

// Setup webhook endpoint
app.post('/webhook/irsmarket', createWebhookMiddleware(webhookHandler));

app.listen(3000);
```

## 📚 API Reference

### IRSMarketClient

#### Constructor

```typescript
new IRSMarketClient(config: ClientConfig)
```

**Config Interface:**
```typescript
interface ClientConfig {
  apikey: string;        // API Key dari IRSMarket
  apisecret: string;     // API Secret dari IRSMarket
  baseURL?: string;      // Default: https://api.irsmarket.com/v1
  timeout?: number;      // Default: 30000ms
}
```

#### Methods

##### `transaction(productcode, trxid, customerno, options?)`

Melakukan transaksi pembelian produk digital.

**Parameters:**
- `productcode` (string) - Kode produk (e.g., TSEL_5000, XL_10000)
- `trxid` (string) - ID transaksi unik dari sistem Anda
- `customerno` (string) - Nomor tujuan (HP/Meter/ID Pelanggan)
- `options?` (object) - Optional parameters
  - `maxprice?` (string) - Harga maksimal yang bersedia dibayar
  - `amount?` (number) - Nominal untuk open denom (10.000 - 500.000)

**Returns:** `Promise<TransactionResponse>`

**Example:**
```javascript
const response = await client.transaction(
  'TSEL_5000',
  'TRX_' + Date.now(),
  '081234567890',
  { maxprice: '5500' }
);
```

##### `transactionByGet(productcode, trxid, customerno, maxprice?)`

Melakukan transaksi dengan metode GET (alternative).

**Returns:** `Promise<TransactionResponse>`

##### `getBalance()`

Mengecek saldo akun Anda.

**Returns:** `Promise<BalanceResponse>`

**Example:**
```javascript
const balance = await client.getBalance();
console.log('Saldo:', balance.data?.balance);
```

##### `validateWebhook(payload)`

Validasi webhook payload (utility method).

**Parameters:**
- `payload` (any) - Webhook payload dari IRSMarket

**Returns:** `boolean` (throws error jika invalid)

##### `static getResponseCodeDescription(code)`

Dapatkan deskripsi dari response code.

**Parameters:**
- `code` (string) - Response code

**Returns:** `string` - Deskripsi

**Example:**
```javascript
const desc = IRSMarketClient.getResponseCodeDescription('00');
console.log(desc); // "Success"
```

### WebhookHandler

#### Methods

##### `on(status, handler)`

Register handler untuk status tertentu.

**Parameters:**
- `status` ('Sukses' | 'Gagal' | 'Pending' | 'all') - Status yang akan dihandle
- `handler` (function) - Async function yang akan dijalankan

```javascript
handler.on('Sukses', async (payload: WebhookPayload) => {
  // Process successful transaction
});
```

##### `process(payload)`

Process webhook payload.

**Parameters:**
- `payload` (object) - Webhook payload dari IRSMarket

**Returns:** `Promise<boolean>`

##### `off(status)`

Remove handler untuk status tertentu.

```javascript
handler.off('Sukses');
```

##### `clear()`

Clear semua handlers.

```javascript
handler.clear();
```

## 📋 Response Examples

### Success Response

```json
{
  "success": true,
  "rc": "00",
  "reff": "1940164",
  "destination": "085235716489",
  "productcode": "S5",
  "msg": "Transaction successful"
}
```

### Balance Response

```json
{
  "success": true,
  "rc": "00",
  "msg": "Success",
  "data": {
    "membername": "Nama Member",
    "balance": "5000000"
  }
}
```

### Webhook Payload

```json
{
  "trxid": 545183516,
  "reff": 120204355,
  "tujuan": "089527787439",
  "produk": "RH5GB2D",
  "harga": 8203,
  "status": "Sukses",
  "rc": "00",
  "sn": "250705092420577LC182",
  "saldo": 16761348,
  "waktu": "2025-07-05 09:24:22"
}
```

## 🔐 Response Codes

| Code | Status | Deskripsi |
|------|--------|-----------|
| 00 | Sukses | Transaksi berhasil diproses |
| 68 | Pending | Transaksi sedang diproses |
| 11 | Error | Invalid API Key |
| 12 | Error | Invalid API Secret |
| 13 | Error | Invalid IP Address |
| 40 | Error | Product Not Found |
| 41 | Error | Product Not Active |
| 61 | Error | Insufficient Balance |
| 62 | Error | Transaction Already Exists |
| 63 | Error | Supplier Not Active |
| 64 | Error | Transaction Processing Error |
| 67 | Error | Max Price Exceeded |
| 71 | Error | Invalid Amount |
| 72 | Error | Invalid Signature |

## 🛠️ Advanced Usage

### Custom Transaction ID Generation

```javascript
function generateTransactionId() {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  return `TRX_${timestamp}_${random}`;
}

const response = await client.transaction(
  'TSEL_5000',
  generateTransactionId(),
  '081234567890'
);
```

### Using MD5 Signature

Alih-alih menggunakan `apisecret` dalam request, Anda bisa menggunakan `sign`:

```javascript
import { generateSignature } from 'irsmarket-sdk-js';

const sign = generateSignature(
  'api_key',
  'api_secret', 
  'TRX_001'
);

// sign hasil MD5 kemudian bisa digunakan dalam request
```

### Error Handling

```javascript
import { IRSMarketError } from 'irsmarket-sdk-js';

try {
  await client.transaction(...);
} catch (error) {
  if (error instanceof IRSMarketError) {
    console.log('Code:', error.code);
    console.log('Message:', error.message);
    console.log('Response:', error.response);
  }
}
```

### Express.js Integration

```javascript
import express from 'express';
import { IRSMarketClient, WebhookHandler, createWebhookMiddleware } from 'irsmarket-sdk-js';

const app = express();
app.use(express.json());

const client = new IRSMarketClient({
  apikey: process.env.IRS_API_KEY!,
  apisecret: process.env.IRS_API_SECRET!
});

const webhookHandler = new WebhookHandler();

// Handle webhook
webhookHandler.on('all', async (payload) => {
  console.log('Transaction Update:', payload);
  
  // Update database
  await saveTransactionStatus(payload.reff, payload.status);
  
  // Send notification
  if (payload.status === 'Sukses') {
    await sendSuccessNotification(payload.tujuan);
  }
});

// Routes
app.post('/api/transaction', async (req, res) => {
  try {
    const { product, phone } = req.body;
    
    const response = await client.transaction(
      product,
      `TRX_${Date.now()}`,
      phone
    );
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/balance', async (req, res) => {
  try {
    const balance = await client.getBalance();
    res.json(balance);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook endpoint
app.post('/webhook/irsmarket', createWebhookMiddleware(webhookHandler));

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Webhook endpoint: http://localhost:3000/webhook/irsmarket');
});
```

## 📝 Type Definitions

Package ini dilengkapi dengan complete TypeScript type definitions:

```typescript
interface ClientConfig { ... }
interface TransactionRequest { ... }
interface TransactionResponse { ... }
interface BalanceRequest { ... }
interface BalanceResponse { ... }
interface WebhookPayload { ... }
interface TransactionOptions { ... }
class IRSMarketError { ... }
```

Lihat file `src/types.ts` untuk type definitions lengkap.

## 🔗 Important Notes

### Webhook Configuration

Pastikan URL webhook sudah dikonfigurasi di dashboard IRSMarket:

URL Callback Pattern:
```
https://api.irsmarket.com/v1/transaction/{system}/callback/{apikey}
```

Dimana `{system}` bisa: `otomax`, `irs`, `st24`, `generic`
Dan `{apikey}` adalah API Key Anda.

### IP Whitelist

Jika menggunakan IRSMarket sebagai seller, whitelist IP IRSMarket:
```
159.65.137.240
```

### Rate Limiting

IRSMarket memiliki rate limiting. Pastikan tidak melakukan request terlalu sering.

## 📖 Documentation

Untuk dokumentasi API lengkap, kunjungi: https://irsmarket.com/integrasi

## 🐛 Troubleshooting

### Error: "Invalid API Key"
- Pastikan API Key benar
- Periksa di dashboard IRSMarket

### Error: "Invalid API Secret"
- Pastikan API Secret sesuai
- Gunakan API Secret dari email pendaftaran atau reset di dashboard

### Error: "Invalid IP Address"
- IP Anda mungkin tidak ter-whitelist
- Hubungi support IRSMarket

### Webhook tidak diterima
- Pastikan URL callback sudah dikonfigurasi di dashboard
- URL harus accessible dari internet
- Return HTTP 200 untuk mengkonfirmasi webhook diterima

## 🤝 Contributing

Kontribusi sangat welcome! Silakan buat pull request atau lapor issue.

## 📄 License

MIT License - Copyright (c) 2025

## 📞 Support

- **IRSMarket Support**: https://irsmarket.com
- **Email**: api-support@aviana.co.id
- **Jam Operasional**: Senin - Sabtu, 08:00 - 17:00 WIB

## Changelog

### v1.0.0 (2025-01-04)
- Initial release
- Full transaction support
- Balance checking
- Webhook handling
- TypeScript support
