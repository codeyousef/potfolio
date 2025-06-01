# 🧪 Testing Guide for Portfolio Project

## Quick Start

```bash
# Frontend tests
cd frontend
npm run test:coverage

# Backend tests  
cd backend
poetry run coverage run --source='.' manage.py test
poetry run coverage report

# Full stack
docker-compose up
# E2E tests ready for implementation
```

## Test Categories

### 🎨 Frontend Tests
- **Component tests**: Button, Navigation, Forms
- **API integration**: All endpoints with mock data
- **Three.js tests**: 3D rendering and interactions
- **Error handling**: Loading states and error boundaries
- **Accessibility**: Screen reader compatibility

### 🔧 Backend Tests
- **Model tests**: Data validation and relationships
- **API tests**: CRUD operations and filtering
- **Security tests**: XSS, SQL injection protection
- **Performance tests**: Bulk operations and query optimization
- **Integration tests**: Complete user workflows

### 🔒 Security Tests
- SQL injection protection
- XSS content sanitization
- File upload validation
- Rate limiting
- CORS configuration

### ⚡ Performance Tests
- Database query optimization
- Large content handling
- Bulk operations (100+ records)
- Three.js rendering performance
- Response time validation

## Coverage Requirements

- **Minimum 80% coverage** for both frontend and backend
- **All security vulnerabilities** must be tested
- **Critical user journeys** must have E2E coverage
- **Error scenarios** must be handled gracefully

## CI/CD Integration

The test suite runs automatically on:
- Every push to main branch
- Every pull request
- Before deployment

Tests must pass with 80% coverage before deployment is allowed.

## Writing New Tests

### Frontend Component Test Example:
```typescript
import { render, screen, fireEvent } from '../test/utils'
import { MyComponent } from './MyComponent'

test('renders and handles click', async () => {
  const handleClick = vi.fn()
  render(<MyComponent onClick={handleClick} />)
  
  await fireEvent.click(screen.getByRole('button'))
  expect(handleClick).toHaveBeenCalled()
})
```

### Backend API Test Example:
```python
from rest_framework.test import APITestCase

class MyAPITest(APITestCase):
    def test_create_project(self):
        data = {'title': 'Test Project'}
        response = self.client.post('/api/projects/', data)
        self.assertEqual(response.status_code, 201)
```

## Test Data & Mocking

- **MSW** handles API mocking for frontend tests
- **Factory patterns** create consistent test data
- **Database transactions** ensure test isolation
- **WebGL mocking** enables Three.js testing

## Performance Testing

```bash
# Backend performance tests
poetry run python manage.py test portfolio.core.test_enhanced.PerformanceTestCase

# Frontend performance monitoring
npm run test:coverage -- --reporter=verbose
```

## Security Testing

```bash
# Automated security scanning
poetry run safety check
poetry run bandit -r .

# Manual security test execution
poetry run python manage.py test portfolio.core.test_enhanced.SecurityTestCase
```

## Debugging Tests

```bash
# Frontend debug mode
npm run test:watch

# Backend debug with coverage
poetry run coverage run --source='.' manage.py test --debug-mode

# View coverage reports
npm run test:coverage && open frontend/coverage/index.html
poetry run coverage html && open backend/htmlcov/index.html
```

## Best Practices

1. **Write tests first** (TDD approach)
2. **Test behavior, not implementation**
3. **Use descriptive test names**
4. **Keep tests isolated and independent**
5. **Mock external dependencies**
6. **Test edge cases and error scenarios**
7. **Maintain test data factories**
8. **Review coverage reports regularly**

## Common Issues & Solutions

### Frontend Tests Failing:
- Check MSW server is running
- Verify WebGL mocking is set up
- Ensure cleanup after each test

### Backend Tests Failing:
- Check database connection
- Verify test isolation
- Clear test data between runs

### Coverage Not Meeting Requirements:
- Identify untested code with coverage reports
- Add tests for missing branches
- Focus on critical business logic

## Test Environment Setup

The test suite requires:
- Node.js 20+ for frontend tests
- Python 3.11+ for backend tests
- PostgreSQL for integration tests
- Docker for E2E tests

All dependencies are automatically installed in CI/CD pipeline.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Django Testing](https://docs.djangoproject.com/en/stable/topics/testing/)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [Three.js Testing](https://threejs.org/)

Your portfolio project now has enterprise-grade test coverage! 🚀
