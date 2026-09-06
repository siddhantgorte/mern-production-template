# 🚀 MERN Production Template

A clean, modular, and production-ready full-stack **MERN (MongoDB, Express, React, Node.js)** template with **Better Auth (Google OAuth SSO)**, **Tailwind CSS**, and a **Modular Architecture**.

---

## 📖 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Local Development Setup](#-local-development-setup)
  - [1. Clone and Install Dependencies](#1-clone-and-install-dependencies)
  - [2. Google Cloud Console Configuration](#2-google-cloud-console-configuration)
  - [3. Environment Variables](#3-environment-variables)
  - [4. Running Locally](#4-running-locally)
- [Production Deployment](#-production-deployment)
  - [1. Backend Deployment (Render)](#1-backend-deployment-render)
  - [2. Frontend Deployment (Vercel)](#2-frontend-deployment-vercel)
  - [3. Production Google OAuth Settings](#3-production-google-oauth-settings)
- [Architecture & Request Flow](#-architecture--request-flow)
- [API Endpoints](#-api-endpoints)
- [Adding New Modules (Backend)](#-adding-new-modules-backend)
- [License](#-license)

---

## ✨ Features

### Backend (`server/`)
- **Modular Architecture**: Feature-based domain modules (`src/modules/users/`) rather than flat MVC.
- **Single DB Connection Pool**: Mongoose + Better Auth share a single native MongoDB connection via `getMongoDB()`.
- **Better Auth (Google SSO)**: Secure cookie-based session management with cross-origin support (`SameSite=None; Secure` in production, `SameSite=Lax` in development).
- **Reverse Proxy Trust**: Configured `trust proxy` for secure HTTPS deployments behind cloud load balancers (Render, Railway, etc.).
- **Standardized Error & Response Formatting**: `ApiError` class and `ApiResponse` static helper methods.
- **DTO Validation**: Declarative validation using `Joi` and `BaseDto` schemas.
- **Production Security**: Helmet, CORS with credentials, Rate Limiting, Request ID tracking, and Morgan request logger.

### Frontend (`client/`)
- **Vite + React 19**: Ultra-fast build and hot module replacement.
- **Tailwind CSS v4**: Modern, responsive utility-first styling.
- **Better Auth Client**: Official `@better-auth/react` client configured with `credentials: "include"`.
- **React Router 7**:
  - Public **Landing Page** (`/`) with Hero and Call-to-Action.
  - Dedicated **Login Page** (`/login`) with Google Single Sign-On.
  - Protected **Dashboard** (`/dashboard`) with navigation guards (`ProtectedRoute`).
- **Dynamic Navbar**: Displays authenticated user's Google profile picture, display name/email, and Logout action.
- **API Client Service**: Pre-configured `api.js` fetch wrapper with `credentials: "include"`.
- **SPA Rewrites**: Pre-configured `vercel.json` for client-side routing on Vercel.

---

## 📁 Project Structure

```text
Mern-Production-Template/
├── server/
│   ├── .env.example
│   ├── package.json
│   ├── server.js                          # Server bootstrap & DB connection (dotenv preloaded)
│   └── src/
│       ├── app.js                         # Express app, middlewares, routes, trust proxy
│       ├── common/
│       │   ├── config/
│       │   │   ├── auth.js                # Better Auth singleton setup (Google SSO)
│       │   │   └── db.js                  # Single Mongoose & MongoDB connection
│       │   ├── dto/
│       │   │   └── base.dto.js            # Base Joi validation class
│       │   ├── middleware/
│       │   │   ├── auth.middleware.js     # Better Auth session guard
│       │   │   ├── error.middleware.js    # Centralized error handler
│       │   │   └── validate.middleware.js # DTO validation middleware
│       │   └── utils/
│       │       ├── api-error.js           # Custom ApiError class
│       │       └── api-response.js        # Standardized ApiResponse helper
│       └── modules/
│           └── users/
│               ├── user.controller.js     # User route controller
│               ├── user.routes.js         # User API endpoints (/api/users)
│               └── user.service.js        # User business logic
│
└── client/
    ├── .env.example
    ├── package.json
    ├── vercel.json                        # SPA routing rewrite rule
    ├── vite.config.js
    └── src/
        ├── App.jsx                        # Application root
        ├── main.jsx                       # React entry point with BrowserRouter
        ├── index.css                      # Tailwind CSS imports
        ├── components/
        │   ├── Navbar.jsx                 # Dynamic header (Profile avatar, Logout)
        │   └── ProtectedRoute.jsx         # Client-side session guard
        ├── pages/
        │   ├── LandingPage.jsx            # Public landing page template
        │   ├── LoginPage.jsx              # Google login page
        │   └── DashboardPage.jsx          # Protected user dashboard
        ├── routes/
        │   └── AppRouter.jsx              # Application route definitions
        ├── lib/
        │   └── auth-client.js             # Better Auth browser client
        └── services/
            └── api.js                     # Generic fetch API wrapper
```

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express 5, MongoDB, Mongoose, Better Auth, Joi, Helmet, CORS, Morgan, Express Rate Limit
- **Frontend**: React 19, Vite, Tailwind CSS v4, Better Auth React, React Router 7, Lucide Icons
- **Authentication**: Better Auth with Google OAuth (HTTP-only cookies)

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB database (local or MongoDB Atlas)
- Google Cloud Console account

---

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/siddhantgorte/mern-production-template.git
cd mern-production-template

# Install all dependencies (root, server, and client) with one command:
npm run install:all
```

---

### 2. Google Cloud Console Configuration

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and configure **APIs & Services > OAuth consent screen**:
   - User Type: **External**
   - Scopes: `email`, `profile`, `openid`
   - Test Users: Add your Google email address.
3. Under **APIs & Services > Credentials > Create Credentials > OAuth Client ID**:
   - Application type: **Web application**
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `http://localhost:5000`
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/callback/google`
4. Copy the generated **Client ID** and **Client Secret**.

---

### 3. Environment Variables

#### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/mern-template?retryWrites=true&w=majority

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Better Auth
BETTER_AUTH_SECRET=your_random_32_character_secret_key
BETTER_AUTH_URL=http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend (Origin without trailing slash)
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env`)
Create `client/.env` based on `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

---

### 4. Running Locally

You can run both backend and frontend concurrently with a single command from the project root:

```bash
npm run dev
```

Or run them individually in separate terminal tabs if preferred:

```bash
# Start backend only
npm run dev:server

# Start frontend only
npm run dev:client
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/health`

---

## 🌐 Production Deployment

### 1. Backend Deployment (Render)

1. Create a new **Web Service** on Render connected to your repository.
2. Root Directory: `server`
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default)
   - `MONGODB_URI`: `mongodb+srv://...`
   - `BETTER_AUTH_SECRET`: `your_random_32_character_secret_key`
   - `BETTER_AUTH_URL`: `https://<your-render-service>.onrender.com` *(no trailing slash)*
   - `CLIENT_URL`: `https://<your-vercel-app>.vercel.app` *(no trailing slash)*
   - `GOOGLE_CLIENT_ID`: `your_google_client_id`
   - `GOOGLE_CLIENT_SECRET`: `your_google_client_secret`

### 2. Frontend Deployment (Vercel)

1. Import your repository on Vercel.
2. Root Directory: `client`
3. Framework Preset: `Vite`
4. Set Environment Variables:
   - `VITE_API_URL`: `https://<your-render-service>.onrender.com` *(no trailing slash)*
5. Deploy.

### 3. Production Google OAuth Settings

Add your production domains to **Google Cloud Console > Credentials > OAuth 2.0 Client ID**:

- **Authorized JavaScript origins**:
  - `https://<your-vercel-app>.vercel.app`
  - `https://<your-render-service>.onrender.com`
- **Authorized redirect URIs**:
  - `https://<your-render-service>.onrender.com/api/auth/callback/google`

---

## 🏛️ Architecture & Request Flow

```text
1. User clicks "Continue with Google" on Frontend (LoginPage.jsx)
   │
2. authClient.signIn.social({ provider: "google" }) redirects to Better Auth handler
   │
3. Express Server (/api/auth/sign-in/social) redirects to Google OAuth consent
   │
4. User authenticates -> Google redirects back to /api/auth/callback/google
   │
5. Better Auth sets HttpOnly session cookie (SameSite=None, Secure in production)
   │
6. User redirected to /dashboard -> ProtectedRoute checks authClient.useSession()
   │
7. Frontend fetches /api/users/me -> authMiddleware attaches session to req.auth
```

---

## 🔌 API Endpoints

| Method | Endpoint | Protection | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/health` | Public | Health check / server status |
| `ALL` | `/api/auth/*` | Public / Better Auth | Better Auth OAuth & session endpoints |
| `GET` | `/api/users/me` | `authMiddleware` | Returns authenticated session user details |

---

## 📦 Adding New Modules (Backend)

To add a new feature (e.g. `posts`), create a folder under `server/src/modules/posts/`:

```text
server/src/modules/posts/
├── post.model.js       # Mongoose Schema & Model
├── post.dto.js         # Joi validation schema extending BaseDto
├── post.service.js     # Database operations and business logic
├── post.controller.js  # Request/response handler using ApiResponse
└── post.routes.js      # Express router with authMiddleware & validate()
```

Then mount the route in `server/src/app.js`:
```javascript
import postRoutes from "./modules/posts/post.routes.js"

app.use("/api/posts", postRoutes)
```

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
