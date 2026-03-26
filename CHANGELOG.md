# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-04

### Added

- Initial release of irsmarket-sdk-js
- Full TypeScript support with type definitions
- **IRSMarketClient** class with core features:
  - Transaction via POST method
  - Transaction via GET method
  - Balance checking
  - Response validation
  - Error handling
  - Response code descriptions
- **WebhookHandler** class:
  - Handle multiple webhook events (Sukses, Gagal, Pending)
  - Status-based event handlers
  - Webhook payload validation
  - Express middleware integration
- **HttpClient** class:
  - Axios-based HTTP client
  - Automatic error handling
  - Request/response interceptors
  - Configurable timeout and headers
- **Utilities**:
  - MD5 signature generation
  - Field validation
  - Currency formatting
  - MD5 format validation
- **Type Definitions**:
  - Comprehensive TypeScript interfaces
  - Custom error class (IRSMarketError)
  - Request/response types
  - Configuration types
- **Documentation**:
  - Complete README with examples
  - Contributing guide
  - API reference
  - Quick start guide
- **Tests**:
  - Jest test suite
  - Mock axios for testing
  - Transaction tests
  - Balance tests
  - Webhook tests
  - Error handling tests
- **Configuration Files**:
  - tsconfig.json for TypeScript
  - jest.config.js for testing
  - .eslintrc.json for linting
  - package.json with scripts

### Features

- Support for multiple authentication methods:
  - API Key + API Secret
  - MD5 Signature
- Transaction handling:
  - POST /transaction endpoint
  - GET /transaction endpoint
  - Custom transaction options (maxprice, amount)
  - Transaction ID generation
- Balance checking:
  - Simple balance endpoint
  - Member information
- Webhook integration:
  - Real-time transaction status updates
  - Event-based handlers
  - Express middleware
  - Payload validation
- Error handling:
  - Custom error messages
  - Response codes with descriptions
  - Detailed error responses
- Type safety:
  - Full TypeScript support
  - Type definitions for all APIs
  - Better IDE autocomplete

### Documentation

- README.md with quick start and examples
- API reference for all classes and methods
- Response examples and codes
- Webhook configuration guide
- Advanced usage examples
- Troubleshooting section
- Contributing guidelines

## [Unreleased]

### Planned Features

- Seller integration support (Otomax, IRS, ST24)
- Product catalog endpoints
- Transaction history
- Rate limiting handling
- Batch transaction support
- More webhook event types
- Dashboard/Admin APIs

---

## Versioning

This project follows [Semantic Versioning](https://semver.org/):
- MAJOR version for incompatible API changes
- MINOR version for new functionality in a backwards compatible manner
- PATCH version for backwards compatible bug fixes

## Support

For issues and questions:
- GitHub Issues: https://github.com/OneNc/irsmarket-sdk-js/issues
- IRSMarket Support: https://irsmarket.com
- Email: api-support@aviana.co.id
