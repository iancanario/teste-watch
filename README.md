
# Teste Watch

A NestJS-based application for managing users and sales.

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- Yarn package manager
- PostgreSQL (v14 or higher)
- Git

## Environment Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd teste-watch
```

2. Install dependencies:
```bash
yarn install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=dev
DB_PASS=dev@1234
DB_NAME=watch
DB_SSL=false

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=key-id
AWS_SECRET_ACCESS_KEY=secret-key
SQS_PRODUCTS_QUEUE_URL=https://localstack/000000000000/products-queue
SQS_SALES_QUEUE_URL=https://localstack/000000000000/sales-queue
```

Adjust the values according to your local setup.

## Database Setup

1. Create the database:
```bash
createdb teste_watch
```

2. Run the database migrations (if any):
```bash
yarn migration:run
```

3. Seed the database with initial data:
```bash
yarn seed
```

This will create an admin user with the following credentials:
- Email: admin@example.com
- Password: admin123

## Running the Application

### Development Mode

```bash
# Start the application in development mode
yarn start:dev

# Start the application in debug mode
yarn start:debug
```

### Production Mode

```bash
# Build the application
yarn build

# Start the application in production mode
yarn start:prod
```

## Testing

```bash
# Unit tests
yarn test

# Test coverage
yarn test:cov
```

## API Documentation

Once the application is running, you can access the Swagger API documentation at:
```
http://localhost:3000/api
```

## Available Scripts

- `yarn start:dev` - Start the application in development mode
- `yarn start:debug` - Start the application in debug mode
- `yarn start:prod` - Start the application in production mode
- `yarn build` - Build the application
- `yarn format` - Format the code using prettier
- `yarn lint` - Lint the code
- `yarn test` - Run unit tests
- `yarn test:e2e` - Run end-to-end tests
- `yarn test:cov` - Run test coverage
- `yarn test:debug` - Run tests in debug mode
- `yarn seed` - Seed the database with initial data

## Project Structure

```
src/
├── users/                 # User management module
│   ├── dto/              # Data Transfer Objects
│   ├── entities/         # Database entities
│   ├── enums/           # Enumerations
│   └── users.service.ts  # User business logic
├── sale/                 # Sales management module
├── seeds/               # Database seeds
└── main.ts              # Application entry point
```

## Authentication

The application uses JWT (JSON Web Tokens) for authentication. To access protected endpoints:

1. Login using the `/auth/login` endpoint
2. Use the returned JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Error Handling

The application uses a global exception filter to handle errors consistently. Common HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 500: Internal Server Error