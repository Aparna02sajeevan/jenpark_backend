# JenPark Backend

REST API for the **JenPark** platform by **Jenx AI Technologies**.

> Production-ready scaffold. Business modules are intentionally **not** implemented — this is the foundation for the internship team.

---

## Project Overview

`jenpark-backend` is the central API layer powering the JenPark admin panel, web app, and mobile app. It is built on Node.js + Express with MongoDB for persistence and follows a layered MVC structure (Routes → Controllers → Services → Repositories → Models).

## Tech Stack

| Layer            | Technology              |
| ---------------- | ----------------------- |
| Runtime          | Node.js (>= 18)         |
| Framework        | Express.js              |
| Database         | MongoDB + Mongoose      |
| Auth             | JWT (access + refresh)  |
| Validation       | Joi                     |
| Logging          | Winston (daily rotate)  |
| API Docs         | Swagger (OpenAPI 3)     |
| Security         | Helmet, CORS, rate-limit|
| Config           | dotenv                  |

## Folder Structure

```
src/
├── app.js                  # Express app (middleware + routes)
├── server.js               # Bootstrap: DB connect + listen
├── config/
│   ├── env.js              # Typed env loader
│   └── db.js               # MongoDB connection
├── controllers/            # Request handlers (thin)
├── services/               # Business logic
├── repositories/           # DB access layer
├── models/                 # Mongoose schemas
├── routes/                 # Express routers (versioned under /api/v1)
├── middlewares/
│   ├── auth.js             # JWT authentication
│   ├── role.js             # Role-based authorization
│   ├── validate.js         # Joi validation factory
│   └── errorHandler.js     # 404 + central error handler
├── validators/             # Joi schemas per module
├── utils/
│   ├── logger.js           # Winston logger
│   ├── ApiError.js         # Operational error class
│   ├── ApiResponse.js      # Uniform success/failure helpers
│   └── asyncHandler.js     # Async error wrapper
├── jobs/                   # Cron / queue workers
└── swagger/                # OpenAPI spec generator
```

## Installation

```bash
git clone https://github.com/jenxtech/jenpark-backend.git
cd jenpark-backend
nvm use            # optional, uses .nvmrc (Node 20)
npm install
```

## Environment Variables

Copy the example file and fill values:

```bash
cp .env.example .env
```

| Variable               | Description                          |
| ---------------------- | ------------------------------------ |
| `PORT`                 | HTTP port (default: 5000)            |
| `MONGO_URI`            | MongoDB connection string            |
| `JWT_SECRET`           | Signing key for access tokens        |
| `JWT_REFRESH_SECRET`   | Signing key for refresh tokens       |
| `AWS_ACCESS_KEY`       | AWS IAM access key (S3 uploads)      |
| `AWS_SECRET_KEY`       | AWS IAM secret                       |
| `AWS_BUCKET`           | S3 bucket name                       |
| `AWS_REGION`           | AWS region                           |
| `CORS_ORIGIN`          | Allowed origin (`*` for dev)         |
| `LOG_LEVEL`            | `error` \| `warn` \| `info` \| `debug` |

## Development Commands

```bash
npm run dev      # nodemon, hot reload
npm start        # node src/server.js
npm run lint     # eslint
npm test         # placeholder
```

## API

Base URL: `http://localhost:5000/api/v1`

### Health Check

```
GET /api/v1/health
```

```json
{
  "success": true,
  "message": "JenPark API Running",
  "data": { "uptime": 12.34, "timestamp": "2026-06-02T10:00:00.000Z", "env": "development" }
}
```

### Swagger

Interactive docs: `http://localhost:5000/api/docs`

## Architecture Overview

```
HTTP Request
    │
    ▼
[Helmet · CORS · RateLimit · Morgan · JSON parser]
    │
    ▼
Route (src/routes)
    │  → validate (Joi)
    │  → authenticate (JWT) → authorize (role)
    ▼
Controller          (thin: parse input, call service, format response)
    │
    ▼
Service             (business logic, orchestrates repositories)
    │
    ▼
Repository          (DB access, isolates Mongoose)
    │
    ▼
Model (Mongoose)
```

Errors thrown anywhere bubble to `errorHandler` which produces a uniform response shape.

## Coding Standards

- Use `asyncHandler` to wrap async controllers.
- Throw `ApiError(statusCode, message, details?)` for expected failures.
- Controllers must stay thin — push logic to services.
- Repositories own all Mongoose calls; services must not import models directly.
- Validate every public route with a Joi schema in `validators/`.
- Document every route with a Swagger JSDoc block.
- Use `logger` instead of `console.*`.
- No secrets in code — only `process.env` via `config/env.js`.

## Branching Strategy

| Branch type | Pattern                  |
| ----------- | ------------------------ |
| Feature     | `feature/<module>`       |
| Bugfix      | `bugfix/<module>`        |
| Hotfix      | `hotfix/<issue>`         |

Mainline: `main`. See [CONTRIBUTING.md](./CONTRIBUTING.md) for commit conventions and PR process.

## License

UNLICENSED — © Jenx AI Technologies. All rights reserved.
