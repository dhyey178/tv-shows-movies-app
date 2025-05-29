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
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Backend Service (NestJS API)

This backend service, built with **NestJS**, provides the API endpoints for the TV Shows & Movies App. It is responsible for:

* Serving paginated lists of movies and TV shows, including their latest reviews.
* Providing detailed views for individual movies and TV shows, along with paginated comments.
* Handling creation of new movies, TV shows, and comments.
* Performing data validation and managing the database schema (SQLite via Prisma).
* Exposing an interactive API documentation via Swagger.

## Technologies Used

* **Framework**: [NestJS](https://nestjs.com/)
* **Database**: SQLite
* **ORM**: [Prisma](https://www.prisma.io/)
* **API Documentation**: [Swagger](https://swagger.io/)
* **Language**: TypeScript

## Endpoints Overview

Here's a summary of the main API endpoints served by this backend:

### Movies

* **`GET /movies`**: Get a paginated list of movies with their latest 5 comments.
* **`POST /movies`**: Create a new movie.
* **`GET /movies/{id}`**: Get a single movie by ID with its latest 5 comments.
* **`GET /movies/{id}/comments`**: Get paginated comments for a specific movie.

### TV Shows

* **`GET /tv-shows`**: Get a paginated list of TV shows with their latest 5 comments.
* **`POST /tv-shows`**: Create a new TV show.
* **`GET /tv-shows/{id}`**: Get a single TV show by ID with its latest 5 comments.
* **`GET /tv-shows/{id}/comments`**: Get paginated comments for a specific TV show.

### Comments

* **`POST /comments`**: Create a new comment for a movie or TV show.

*(Note: APIs for creating movies, TV shows, and adding comments are currently exposed via the API but do not have a direct frontend UI. You can test these functionalities using tools like Postman or through the Swagger UI.)*

## Local Setup

**Important:** For overall monorepo setup, please refer to the main `README.md` in the project root. The following steps are specific to running and managing the backend in isolation.

### Prerequisites

* Node.js v20
* pnpm v10

### Installation

If you are only working on the backend or need to install its dependencies specifically:

* Install Dependencies
```bash
pnpm install
```

* Create env or copy `.env.example`
```bash
cp .env.example .env
```

* Initialize Database
```bash
pnpm db:init
```

* Seed Database
``` bash
pnpm prisma:seed
```

* Start Backend 
``` bash
pnpm start:dev
```

### API Documentation (Swagger)
Once the backend service is running, you can access the interactive Swagger UI at:
`http://localhost:4200/api`
This interface allows you to explore the available API endpoints and test them directly in your browser.


### Testing
```bash
pnpm test
```

### Database Management

The backend uses SQLite as its database, managed by Prisma.

* **Database File Location:** Your local database file is located at `prisma/prisma/dev.db` (path configurable through `.env`). This file is ignored by Git and should not be committed.

* **Prisma Schema:** The database schema is defined in `prisma/schema.prisma`.

* **Migrations:** Database migrations are located in `prisma/migrations/`.

## Resources

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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
