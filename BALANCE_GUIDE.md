# Check Balance - Quick Start Guide

Panduan cepat untuk menggunakan fitur Check Balance dalam IRSMarket SDK.

## Setup

```typescript
import { IRSMarketClient } from 'irsmarket-sdk';

const client = new IRSMarketClient({
  apikey: 'your_api_key',
  apisecret: 'your_api_secret'
});
```

## 📊 Mengecek Saldo - Cara-cara Berbeda

### 1️⃣ Cara Paling Sederhana

```typescript
async function checkBalance() {
  const balance = await client.getBalance();
  console.log('Saldo Anda:', balance.data?.balance);
}
```

### 2️⃣ Dengan Error Handling

```typescript
async function checkBalanceSafely() {
  try {
    const balance = await client.getBalance();
    
    if (balance.success) {
      console.log('✅ Nama Member:', balance.data?.membername);
      console.log('✅ Saldo:', balance.data?.balance);
    } else {
      console.log('❌ Error:', balance.msg);
    }
  } catch (error) {
    console.error('❌ Network Error:', error.message);
  }
}
```

### 3️⃣ Dengan Status Code Explanation

```typescript
async function checkBalanceWithDetails() {
  try {
    const balance = await client.getBalance();
    const description = IRSMarketClient.getResponseCodeDescription(balance.rc);
    
    console.log('Response Code:', balance.rc);
    console.log('Description:', description);
    console.log('Balance:', balance.data?.balance);
    
  } catch (error: any) {
    const desc = IRSMarketClient.getResponseCodeDescription(error.code);
    console.error(`Error (${error.code}): ${desc}`);
  }
}
```

### 4️⃣ Dalam Express.js Route

```typescript
import express from 'express';
import { IRSMarketClient } from 'irsmarket-sdk';

const app = express();
const client = new IRSMarketClient({
  apikey: process.env.IRS_API_KEY,
  apisecret: process.env.IRS_API_SECRET
});

// GET endpoint untuk cek saldo
app.get('/api/balance', async (req, res) => {
  try {
    const balance = await client.getBalance();
    
    if (balance.success) {
      res.json({
        status: 'success',
        data: balance
      });
    } else {
      res.status(400).json({
        status: 'error',
        message: balance.msg
      });
    }
  } catch (error: any) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});
```

### 5️⃣ Cek Balance Sebelum Transaksi

```typescript
async function purchaseWithBalanceCheck(
  productCode: string, 
  phone: string,
  requiredAmount: number
) {
  // 1. Check balance first
  const balance = await client.getBalance();
  
  if (!balance.success) {
    throw new Error(`Failed to check balance: ${balance.msg}`);
  }
  
  const currentBalance = Number(balance.data?.balance);
  
  // 2. Verify sufficient balance
  if (currentBalance < requiredAmount) {
    throw new Error(
      `Insufficient balance. Have: ${currentBalance}, Need: ${requiredAmount}`
    );
  }
  
  // 3. Proceed with transaction
  const response = await client.transaction(
    productCode,
    `TRX_${Date.now()}`,
    phone
  );
  
  return response;
}
```

### 6️⃣ Periodic Balance Check

```typescript
async function startBalanceMonitoring(intervalSeconds: number = 5) {
  setInterval(async () => {
    try {
      const balance = await client.getBalance();
      console.log(`[${new Date().toISOString()}] Balance: Rp ${balance.data?.balance}`);
    } catch (error: any) {
      console.error(`[${new Date().toISOString()}] Error: ${error.message}`);
    }
  }, intervalSeconds * 1000);
}

// Gunakan
startBalanceMonitoring(10); // Check every 10 seconds
```

## 📋 Response Structure

### Success Response

```json
{
  "success": true,
  "rc": "00",
  "msg": "Success",
  "data": {
    "membername": "John Doe",
    "balance": "1500000"
  }
}
```

### Error Response

```json
{
  "success": false,
  "rc": "11",
  "msg": "Invalid API Key"
}
```

## 🔐 Common Response Codes

| Code | Meaning | Action |
|------|---------|--------|
| `00` | Success | ✅ Saldo berhasil diambil |
| `11` | Invalid API Key | ❌ Periksa API Key Anda |
| `12` | Invalid API Secret | ❌ Periksa API Secret Anda |
| `13` | Invalid IP | ❌ IP Anda belum di-whitelist |

## 💾 Type Definitions

```typescript
interface BalanceResponse {
  success: boolean;
  rc: string;
  msg?: string;
  data?: {
    membername?: string;
    balance?: number | string;
  };
}
```

## 🧪 Testing

Run balance tests:
```bash
npm run test -- balance.test.ts
```

## 📚 More Examples

Lihat file `examples/balance-example.ts` untuk lebih banyak contoh penggunaan.

## ❓ Troubleshooting

### "Invalid API Key"
- Periksa apakah API Key benar
- Lihat di email pendaftaran atau dashboard IRSMarket

### "Invalid IP Address"
- Whitelist IP Anda di dashboard IRSMarket
- Atau hubungi support

### Network timeout
- Periksa koneksi internet
- Coba lagi dengan delay

## 🔗 Dokumentasi Lengkap

Lihat [README.md](../README.md) untuk dokumentasi lebih lengkap.
