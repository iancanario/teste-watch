<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ yarn install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

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
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=teste_watch
DB_SSL=false

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=1d
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

# e2e tests
yarn test:e2e

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