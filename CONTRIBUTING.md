# Contributing to IRSMarket SDK

Terima kasih telah tertarik untuk berkontribusi! Panduan ini akan membantu Anda.

## 🚀 Getting Started

### Prerequisites
- Node.js >= 14
- npm atau yarn
- Git

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/yourusername/irsmarket-sdk.git
cd irsmarket-sdk

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env dengan credentials Anda
nano .env
```

### Build Project

```bash
# Compile TypeScript
npm run build

# Watch mode for development
npm run watch
```

### Run Tests

```bash
# Run all tests
npm run test

# Watch mode for tests
npm run test:watch

# With coverage
npm run test -- --coverage
```

### Linting

```bash
# Check code quality
npm run lint

# Fix auto-fixable issues
npm run lint -- --fix
```

## 📝 Development Process

1. **Create a branch** untuk fitur/fix Anda
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes** dan pastikan:
   - Code mengikuti style guide
   - Tests semua pass
   - No linting errors

3. **Commit changes** dengan message yang jelas
   ```bash
   git commit -m "feat: add new feature"
   ```

4. **Push ke repository**
   ```bash
   git push origin feature/my-feature
   ```

5. **Create Pull Request** dengan deskripsi yang jelas

## 🎯 Code Style

- Use TypeScript untuk type safety
- Follow ESLint rules
- Use meaningful variable/function names
- Add JSDoc comments untuk public APIs
- Keep functions small dan focused

### Example:

```typescript
/**
 * Perform transaction with IRSMarket API
 * @param productcode - Product code (e.g., TSEL_5000)
 * @param trxid - Unique transaction ID
 * @param customerno - Customer number
 * @returns Transaction response
 * @throws IRSMarketError if transaction fails
 */
async function transaction(
  productcode: string,
  trxid: string,
  customerno: string
): Promise<TransactionResponse> {
  // Implementation
}
```

## ✅ Testing

- Setiap fitur harus memiliki tests
- Tests harus comprehensive dan cover different scenarios
- Mock external API calls
- Use descriptive test names

### Example Test:

```typescript
describe('IRSMarketClient', () => {
  describe('transaction', () => {
    it('should successfully perform transaction', async () => {
      // Test implementation
    });

    it('should throw error on invalid product', async () => {
      // Error handling test
    });
  });
});
```

## 🐛 Reporting Issues

Jika menemukan bug:

1. **Check existing issues** apakah sudah dilaporkan
2. **Create new issue** dengan:
   - Clear title
   - Detailed description
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment info (Node version, OS, etc)

## 💡 Feature Requests

Untuk feature requests:

1. Describe use case Anda
2. Explain bagaimana feature ini akan membantu
3. Provide examples jika ada

## 🔄 Types Contribution

Kami welcome contributions untuk:
- Bug fixes
- Performance improvements
- New features
- Documentation updates
- Tests
- Type definitions improvements

## 📚 Documentation

- Update README.md jika ada API changes
- Add JSDoc comments untuk public methods
- Keep examples updated
- Document breaking changes

## 🏷️ Commit Message Format

Follow conventional commits:

```
type(scope): subject

body

footer
```

### Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build, dependencies, etc

### Examples:
```
feat(transaction): add support for MD5 signature
fix(webhook): handle missing fields validation
docs: update API reference
test(client): add transaction tests
```

## 📦 Release Process

Maintainers handle releases:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create tag on GitHub
4. Publish to npm

## ❓ Questions?

- Open an issue with your question
- Tag it as `question`
- We'll help ASAP!

## Code of Conduct

- Be respectful
- Be helpful
- No harassment
- Be constructive in feedback

---

Thank you for contributing! 🙏
