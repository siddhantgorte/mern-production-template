# MERN Production Template

This repository is a reusable production-oriented backend template for a MERN-style application. At the moment, the codebase contains the server-side foundation for an Express + MongoDB + Better Auth application, with a reusable module structure for future features.

This repository does not currently include a frontend application, so the documentation below focuses on the backend implementation that is actually present in the codebase.

## Table of Contents

- [Project Overview](#project-overview)
- [Repository Structure](#repository-structure)
- [Technology Stack](#technology-stack)
- [Architecture and Request Flow](#architecture-and-request-flow)
- [Environment Variables](#environment-variables)
- [Installation and Setup](#installation-and-setup)
- [Database Configuration](#database-configuration)
- [Authentication](#authentication)
- [Users Module](#users-module)
- [Validation Architecture](#validation-architecture)
- [Middleware](#middleware)
- [Error Handling and API Responses](#error-handling-and-api-responses)
- [API Reference](#api-reference)
- [Development Conventions](#development-conventions)
- [Security Notes](#security-notes)
- [Reusable Module Pattern](#reusable-module-pattern)
- [Possible Future Improvements](#possible-future-improvements)

## Project Overview

The project is designed as a starting point for future applications that need:

- Express 5 backend
- MongoDB + Mongoose integration
- Better Auth authentication
- Reusable module-based feature organization
- Centralized validation and error handling
- Standardized API response formatting

The current implementation includes a working users module, authentication middleware, and relevant backend infrastructure for a production-style Express service.

## Repository Structure

The workspace contains a single server application under the `server/` directory.

```text
Mern-Production-Template/
├── server/
│   ├── .env
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── common/
│       │   ├── config/
│       │   │   ├── auth.js
│       │   │   ├── db.js
│       │   │   └── process.js
│       │   ├── dto/
│       │   │   └── base.dto.js
│       │   ├── middleware/
│       │   │   ├── auth.middleware.js
│       │   │   ├── error.middleware.js
│       │   │   ├── logger.middleware.js
│       │   │   ├── not-found.middleware.js
│       │   │   ├── rate-limit.middleware.js
│       │   │   ├── request-id.middleware.js
│       │   │   └── validate.middleware.js
│       │   └── utils/
│       │       ├── api-error.js
│       │       └── api-response.js
│       └── modules/
│           ├── _template/
│           │   ├── _template.controller.js
│           │   ├── _template.model.js
│           │   ├── _template.routes.js
│           │   └── _template.service.js
│           └── users/
│               ├── user.controller.js
│               ├── user.dto.js
│               ├── user.model.js
│               ├── user.routes.js
│               └── user.service.js
```

### Purpose of the main folders

- `common/`: shared application infrastructure used across the app
- `config/`: database, auth, and process-level configuration
- `dto/`: DTO definitions and validation schemas
- `middleware/`: request middleware for auth, validation, logging, error handling, and routing protection
- `utils/`: reusable helpers such as API error and response wrappers
- `modules/`: feature-focused modules organized by domain
- `users/`: application-level user profile and user-related endpoints
- `_template/`: starter module pattern for creating new features

## Technology Stack

The backend currently uses the following packages from `server/package.json`:

- Express 5 (`express`)
- MongoDB driver (`mongodb`)
- Mongoose (`mongoose`)
- Better Auth (`better-auth`)
- Joi (`joi`)
- CORS (`cors`)
- Helmet (`helmet`)
- Rate limiting (`express-rate-limit`)
- Dotenv (`dotenv`)
- Nodemon for development (`nodemon`)

## Architecture and Request Flow

The backend follows a modular architecture rather than a single global MVC layout. Each feature is organized under `src/modules/<feature>/` with separate responsibilities for routes, controller logic, and service logic.

The general request flow is:

```text
Request
→ Middleware
→ Authentication
→ Validation
→ Controller
→ Service
→ Model / Database
→ API Response
```

This is reflected in the current users flow and the reusable module structure.

## Environment Variables

Environment variables are defined in `server/.env.example` and should be copied into a local `.env` file before running the server.

```env
# Server
PORT=3000
NODE_ENV=development

# MongoDB
MONGODB_URI=

# Better Auth
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:3000

# Frontend
CLIENT_URL=http://localhost:5173
```

### Variable descriptions

| Variable | Purpose |
| --- | --- |
| `PORT` | Port number used by the Express server. Default is `3000` in the project config. |
| `NODE_ENV` | Runtime environment indicator used by error handling logic. |
| `MONGODB_URI` | MongoDB connection string used by Mongoose and the Better Auth MongoDB adapter. |
| `BETTER_AUTH_SECRET` | Secret used by Better Auth for signing and session security. |
| `BETTER_AUTH_URL` | Base URL used by Better Auth. |
| `CLIENT_URL` | Trusted frontend origin used by CORS and Better Auth trusted origins. |

Never commit real secrets or production credentials into source control.

## Installation and Setup

From the project root:

```bash
cd server
npm install
cp .env.example .env
```

Then configure the values in `.env` before starting the app.

### Start the development server

```bash
npm run dev
```

This runs the app through `nodemon server.js`.

### Start the production server

```bash
npm start
```

This runs `node server.js`.

## Database Configuration

The project connects to MongoDB using both Mongoose and the native MongoDB client.

- `mongoose.connect(process.env.MONGODB_URI)` is used for the application model layer.
- `MongoClient` is also created and connected to the same database so Better Auth can use the MongoDB adapter.
- The connection is created in `src/common/config/db.js`.

The repository does not expose any real MongoDB URI or credentials in source files.

### Database note

Better Auth is configured with the MongoDB adapter, and the code uses its database connection for authentication storage. The application also defines an application-level `User` model for user profiles associated with Better Auth users.

## Authentication

Authentication is handled through Better Auth.

The configuration in `src/common/config/auth.js` includes:

- MongoDB adapter for Better Auth
- `baseURL` from `BETTER_AUTH_URL`
- `secret` from `BETTER_AUTH_SECRET`
- `trustedOrigins` from `CLIENT_URL`
- email/password authentication enabled via `emailAndPassword: { enabled: true }`

The app exposes the Better Auth request handler under:

```text
/api/auth/*
```

This is mounted in `src/app.js` through:

```js
app.all("/api/auth/*splat", (req, res) => {
  return toNodeHandler(getAuth())(req, res)
})
```

The authentication middleware in `src/common/middleware/auth.middleware.js` calls Better Auth's `getSession` API using `fromNodeHeaders(req.headers)`. If no valid session is found, it rejects the request with an unauthorized error.

This project uses a session-based authentication flow via Better Auth, and the application profile is associated with the Better Auth user through `authUserId` on the application `User` model.

## Users Module

The current users module stores an application-level user profile that is associated with a Better Auth user.

### User model

The `User` model in `src/modules/users/user.model.js` currently includes:

- `authUserId` (required, unique)
- `name` (required)
- `email` (required, unique, lowercase, trimmed)
- `createdAt` and `updatedAt` from Mongoose timestamps

### Current API endpoints

| Method | Endpoint | Authentication | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/users/me` | Required | Returns the authenticated user's application profile and creates it if missing. |
| `PATCH` | `/api/users/me` | Required | Updates the authenticated user's profile name. |
| `ALL` | `/api/auth/*` | Varies by Better Auth route | Better Auth route handling. |
| `GET` | `/health` | Not required | Simple health check endpoint. |

### Behavior

#### GET /api/users/me

- Validates the current session via Better Auth.
- Reads the authenticated user from `req.auth.user`.
- Calls `getOrCreateUser()` to ensure an application profile exists.
- Returns the user profile in the standard API response format.

#### PATCH /api/users/me

- Requires authentication.
- Validates the request body using `UpdateUserDto` and Joi.
- Allows updating the user's `name`.
- Does not allow the client to change `authUserId`.
- Uses the authenticated Better Auth user ID implicitly rather than accepting a user ID from the request body.

## Validation Architecture

Validation is implemented with Joi and a reusable `BaseDto` class.

`src/common/dto/base.dto.js` contains a `BaseDto` class with:

- `Joi.object({})` as the default schema
- `validate(data)` that returns `{ errors, value }`
- `abortEarly: false` so all validation problems are reported together
- `stripUnknown: true` to remove keys not defined in the schema

The validation middleware in `src/common/middleware/validate.middleware.js` does the following:

- calls `DtoClass.validate(req.body)`
- throws `ApiError.badRequest(...)` if validation fails
- replaces `req.body` with the sanitized validated value
- calls `next()` on success

Validation is currently applied to the request body for the user update endpoint. The codebase does not show query-string or route-parameter validation middleware.

## Middleware

The application registers middleware in `src/app.js` in the following order:

1. `requestIdMiddleware`
2. `logger`
3. `helmet()`
4. `cors({ origin: process.env.CLIENT_URL, credentials: true })`
5. `apiRateLimiter`
6. Better Auth route handling (`/api/auth/*`)
7. JSON and URL-encoded body parsers
8. `userRoutes`
9. `GET /health`
10. `notFoundMiddleware`
11. `errorMiddleware`

### Middleware implemented in the project

- `request-id.middleware.js`: assigns a request ID to each request and adds the `X-Request-ID` response header.
- `logger.middleware.js`: logs method, URL, status code, and latency.
- `helmet`: adds basic HTTP security headers.
- `cors`: allows configured frontend origin access with credentials.
- `rate-limit.middleware.js`: applies rate limiting to API requests.
- `auth.middleware.js`: fetches the active Better Auth session and rejects unauthenticated requests.
- `validate.middleware.js`: enforces Joi-based DTO validation for request bodies.
- `not-found.middleware.js`: converts unknown routes into a 404 API error.
- `error.middleware.js`: centralizes error handling and sends JSON responses.

`express.json({ limit: "1mb" })` and `express.urlencoded({ extended: true, limit: "1mb" })` are also configured.

## Error Handling and API Responses

The project defines two reusable response helpers:

### `ApiError`

In `src/common/utils/api-error.js`, the app defines a custom `ApiError` with status codes for:

- `400` Bad Request
- `401` Unauthorized
- `403` Forbidden
- `404` Not Found
- `409` Conflict

This class is used throughout the app to raise structured errors.

### `ApiResponse`

In `src/common/utils/api-response.js`, responses follow this pattern:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

The project mostly uses this wrapper for successful responses.

### Global error handling

The global error middleware in `src/common/middleware/error.middleware.js`:

- logs the error
- chooses the status code from `err.statusCode` or falls back to `500`
- hides internal details in production when appropriate
- returns JSON with `success: false`, `message`, and `requestId`

Example error format:

```json
{
  "success": false,
  "message": "Unauthorized",
  "requestId": "..."
}
```

The `requestId` is set by the request ID middleware and included in error responses when the request passes through that middleware.

### 404 handling

`not-found.middleware.js` catches unmatched routes and passes an `ApiError.notFound(...)` to the global error middleware.

### Process-level error handlers

`src/common/config/process.js` registers:

- `uncaughtException`
- `unhandledRejection`

These handlers log the issue and exit the process to avoid continuing in an unstable state.

## API Reference

### Health check

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Returns a simple success response indicating the server is running. |

### User endpoints

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `GET` | `/api/users/me` | Yes | Returns the authenticated user's application profile. |
| `PATCH` | `/api/users/me` | Yes | Updates the authenticated user's profile information. |

### Better Auth route mount

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| `ALL` | `/api/auth/*` | Depends on Better Auth route | Routes requests to the configured Better Auth handler. |

### Example requests

#### Get current user

```http
GET /api/users/me
```

Requires an authenticated Better Auth session.

#### Update current user

```http
PATCH /api/users/me
Content-Type: application/json
```

Example body:

```json
{
  "name": "Jane Doe"
}
```

The app sanitizes unknown fields and only allows the `name` field in the current DTO schema.

## Development Conventions

The codebase shows a few clear patterns that are worth following when building on this template:

- ES modules are used (`import` / `export` syntax)
- async/await is used for database and auth operations
- Modules are organized by feature rather than by a single global MVC structure
- Controller/service layering is used in the users module and template module
- DTO validation is centralized via Joi and a base DTO class
- errors are centralized via `ApiError`
- successful responses are centralized via `ApiResponse`

## Security Notes

The project implements several security-related measures:

- CORS is configured with a trusted frontend origin
- Helmet adds security headers
- Rate limiting is enabled for API requests
- Request body size limits are enforced (`1mb` JSON and form bodies)
- Better Auth is used for session-based authentication
- Joi validation sanitizes incoming request bodies
- Secrets are expected to come from environment variables rather than being embedded in source files

This repository is not claiming complete or exhaustive security coverage; it provides a reasonable production-oriented foundation with common backend protections enabled.

## Reusable Module Pattern

The project includes a template module in `server/src/modules/_template/` that demonstrates the module pattern:

```text
_template/
├── _template.controller.js
├── _template.routes.js
├── _template.service.js
├── _template.model.js
```

This pattern can be used as a starting point for new features:

1. Copy the `_template` folder
2. Rename the files to match the new feature name
3. Update the routes, controller, and service logic
4. Add a model only when the feature needs one

The codebase does not enforce a rigid “every module must have a model” rule; the template simply provides a reusable pattern.

## Database Collections

The application defines a Mongoose model named `User` for application-level user profiles. Better Auth is configured to use the MongoDB adapter and manages authentication records in the database it uses. In practical terms, the project clearly relies on a MongoDB database with at least:

- `users` collection for the application profile model
- Better Auth-managed auth collections such as `user`, `session`, and `account`, depending on the adapter’s schema conventions

The repository itself does not define those Better Auth collection schemas directly; they are managed by Better Auth through the configured MongoDB adapter.

## Possible Future Improvements

These are ideas for future work and are not currently implemented in the repository:

- Environment variable validation at startup
- Automated tests for controllers, services, and middleware
- API documentation tooling such as Swagger or OpenAPI generation
- Production deployment configuration
- Additional authentication providers
- More reusable feature modules beyond the starter pattern

## Notes

- The repository is currently backend-focused; no frontend code is present in the workspace.
- The app uses a modular server architecture intended to be extended for future projects.
- The current implementation already includes common production boilerplate for authentication, validation, monitoring, and API responses.
