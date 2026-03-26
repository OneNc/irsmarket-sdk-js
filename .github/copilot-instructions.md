<!-- Custom instructions for IRSMarket SDK VS Code workspace -->

# IRSMarket SDK Development Guide

This workspace contains the Node.js SDK for IRSMarket API integration.

## Project Overview

**irsmarket-sdk** is a TypeScript SDK for integrating with IRSMarket's digital product API (pulsa, kuota, voucher, etc).

### Key Features
- Transaction management (Telkomsel, XL, Indosat, etc)
- Balance checking
- Real-time webhook notifications
- Full TypeScript support
- Express.js middleware

## Project Structure

```
├── src/
│   ├── index.ts              # Main entry point
│   ├── types.ts              # Type definitions
│   ├── utils.ts              # Utility functions
│   ├── HttpClient.ts         # HTTP client
│   ├── IRSMarketClient.ts    # Main client class
│   ├── WebhookHandler.ts     # Webhook handler
│   ├── example.ts            # Usage examples
│   └── __tests__/
│       └── client.test.ts    # Jest tests
├── dist/                     # Compiled JavaScript (generated)
├── package.json              # Project manifest
├── tsconfig.json             # TypeScript config
├── jest.config.js            # Jest config
├── .eslintrc.json            # ESLint config
├── README.md                 # Main documentation
├── EXAMPLES.md               # Integration examples
├── CONTRIBUTING.md           # Contribution guide
└── CHANGELOG.md              # Version history
```

## Development Commands

### Build
```bash
npm run build      # Compile TypeScript to JavaScript
npm run watch      # Watch mode - auto-compile on changes
```

### Testing
```bash
npm run test              # Run all tests once
npm run test:watch       # Watch mode for tests
npm test -- --coverage   # Generate coverage report
```

### Code Quality
```bash
npm run lint             # Check code quality
npm run lint -- --fix    # Auto-fix linting issues
```

### Publish
```bash
npm publish              # Publish to npm registry
```

## API Reference

### IRSMarketClient
- `transaction(productcode, trxid, customerno, options?)` - Perform transaction
- `transactionByGet(...)` - Transaction via GET method
- `getBalance()` - Check account balance

### WebhookHandler
- `on(status, handler)` - Register event handler
- `process(payload)` - Process webhook payload
- `off(status)` - Remove handler
- `clear()` - Clear all handlers

### Utilities
- `generateSignature()` - Generate MD5 signature
- `validateRequired()` - Validate required fields
- `isValidMD5()` - Validate MD5 format
- `formatCurrency()` - Format to IDR currency

## Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 00 | Success | Transaction successful |
| 68 | Pending | Transaction in progress |
| 61 | Error | Insufficient balance |
| 62 | Error | Transaction already exists |
| 11-13 | Error | Authentication errors |
| 40-43 | Error | Product-related errors |

Full code reference in `README.md`

## Configuration

### Environment Variables (.env)
```
IRS_API_KEY=your_key
IRS_API_SECRET=your_secret
IRS_BASE_URL=https://api.irsmarket.com/v1
IRS_TIMEOUT=30000
WEBHOOK_PORT=3000
```

### Client Initialization
```typescript
const client = new IRSMarketClient({
  apikey: 'your_key',
  apisecret: 'your_secret',
  baseURL: 'https://api.irsmarket.com/v1',
  timeout: 30000
});
```

## Common Tasks

### Adding a New Feature
1. Create feature branch: `git checkout -b feature/my-feature`
2. Add code in `src/`
3. Add tests in `src/__tests__/`
4. Run tests: `npm run test`
5. Commit and push
6. Create Pull Request

### Writing Tests
- Use Jest framework
- Place tests in `src/__tests__/` directory
- Mock external API calls with jest.mock()
- Test both success and error scenarios
- Use descriptive test names

Example:
```typescript
describe('IRSMarketClient', () => {
  it('should successfully perform transaction', async () => {
    // Test implementation
  });
});
```

### Publishing to npm
1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Run `npm run build` to compile
4. Run `npm test` to verify
5. Run `npm publish`
6. Create GitHub release

## Documentation

- **README.md** - Main documentation and quick start
- **EXAMPLES.md** - Integration examples (Express, webhooks, etc)
- **CONTRIBUTING.md** - Guidelines for contributors
- **CHANGELOG.md** - Version history

## IRSMarket API Documentation

External API spec: https://irsmarket.com/integrasi

Key endpoints:
- `POST /v1/transaction` - Perform transaction
- `GET /v1/transaction` - Transaction via GET
- `POST /v1/balance` - Check balance
- Webhooks: Transaction status updates

## Troubleshooting

### Module not found errors
- Run `npm install` to install dependencies
- Run `npm run build` to compile TypeScript

### Test failures
- Check `src/__tests__/` for test files
- Run `npm run test:watch` for debugging
- Mock external calls properly

### Linting errors
- Run `npm run lint -- --fix` to auto-fix
- Manual fixes if needed

### Build errors
- Check TypeScript syntax
- Verify all imports/exports
- Run `npm run build` to get detailed errors

## Support

- GitHub Issues: Report bugs or request features
- IRSMarket Support: api-support@aviana.co.id
- Documentation: See README.md and EXAMPLES.md

## Best Practices

1. **Always validate input** - Check product codes, phone numbers
2. **Handle errors gracefully** - Catch IRSMarketError
3. **Use unique transaction IDs** - Prevent duplicate transactions
4. **Implement webhook handlers** - Update database on transaction status
5. **Log transactions** - For debugging and auditing
6. **Test thoroughly** - Unit and integration tests
7. **Follow commit conventions** - feat/fix/docs/test/etc
8. **Document changes** - Update README and EXAMPLES as needed

## Useful Links

- [IRSMarket Platform](https://irsmarket.com)
- [API Documentation](https://irsmarket.com/integrasi)
- [npm Package](https://npmjs.com/package/irsmarket-sdk)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Documentation](https://jestjs.io/docs)
