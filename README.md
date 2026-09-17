# 🚀 MERN Production Template

A clean, modular, and battle-tested full-stack **MERN (MongoDB, Express, React, Node.js)** production boilerplate featuring **Better Auth (Google OAuth SSO & Email/Password)**, **Tailwind CSS v4**, **TanStack Query**, **Sonner Toasts**, **Error Boundaries**, and a **Modular Backend Architecture**.

---

## 📖 Table of Contents

- [Features](#-features)
- [Repository Branches](#-repository-branches)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [How to Obtain Environment Variables](#-how-to-obtain-environment-variables)
  - [1. MongoDB Atlas Connection URI (`MONGODB_URI`)](#1-mongodb-atlas-connection-uri-mongodb_uri)
  - [2. Better Auth Secret (`BETTER_AUTH_SECRET`)](#2-better-auth-secret-better_auth_secret)
  - [3. Google OAuth Credentials (`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`)](#3-google-oauth-credentials-google_client_id--google_client_secret)
  - [4. URL Configuration Rules](#4-url-configuration-rules)
- [Local Development Setup](#-local-development-setup)
- [Production Deployment Walkthrough](#-production-deployment-walkthrough)
  - [1. Backend Deployment (Render)](#1-backend-deployment-render)
  - [2. Frontend Deployment (Vercel)](#2-frontend-deployment-vercel)
  - [3. Updating Google Cloud Console for Production](#3-updating-google-cloud-console-for-production)
- [Architecture & Request Flow](#-architecture--request-flow)
- [API Endpoints Reference](#-api-endpoints-reference)
- [Adding New Backend Modules](#-adding-new-backend-modules)
- [Future Enhancements & Roadmap](#-future-enhancements--roadmap)
- [License](#-license)

---

## ✨ Features

### Backend (`server/`)
- **Modular Feature Architecture**: Domain-driven directory organization (`src/modules/users/`) rather than traditional flat MVC.
- **Unified MongoDB Connection Pool**: Single native database connection shared seamlessly between Mongoose ODM and Better Auth adapters via `getMongoDB()`.
- **Better Auth Integration**:
  - Google OAuth 2.0 Single Sign-On (SSO).
  - Email & Password registration and login with salted `scrypt` cryptographic password hashing.
  - Automatic cross-provider account linking for shared email addresses.
  - Cross-origin cookie handling (`SameSite=None; Secure` in production, `SameSite=Lax` in local development).
- **Graceful Server Shutdown**: Handles `SIGTERM` and `SIGINT` signals with HTTP connection draining, timeout fallback, and safe MongoDB pool disconnection.
- **Fail-Fast Environment Validation**: Validates all required environment variables on startup using `Joi` before listening on a port.
- **Production Hardening**: Reverse proxy trust (`app.set("trust proxy", 1)`), Helmet security headers, CORS with credentials, Rate Limiting, Request ID tracking, and Morgan request logging.
- **Standardized Responses & Errors**: Centralized `ApiError` class and static `ApiResponse` helpers.

### Frontend (`client/`)
- **Vite + React 19**: Lightning-fast hot module replacement and optimized production bundle builds.
- **Tailwind CSS v4**: Modern, responsive utility-first styling with sleek dark-mode aesthetics.
- **TanStack React Query**: Pre-configured `QueryClientProvider` for global caching, background refetching, and state management.
- **Sonner Toast Notifications**: Global stackable toast feedback for login, registration, logout, and API actions.
- **React Error Boundary**: Catches unhandled runtime rendering errors and displays a user-friendly recovery card.
- **React Router 7**:
  - Public **Landing Page** (`/`).
  - Auth **Login & Sign-Up Page** (`/login`) with tab switching and Google SSO.
  - Protected **Dashboard** (`/dashboard`) guarded by `ProtectedRoute`.
- **Dynamic Navbar**: Displays profile picture/initials, user email/name, and Sign Out action.
- **API Client Service**: Pre-configured `api.js` fetch wrapper with automated credentials and header injection.

---

## 🌿 Repository Branches

| Branch | Description | Use Case |
|---|---|---|
| **`main`** | Google OAuth Single Sign-On (SSO) | Clean, streamlined starter for apps prioritizing 1-click Google authentication. |
| **`feat/email-password-auth`** | Google OAuth + Email/Password Auth | Full-featured authentication with sign-in and registration tabs + Google SSO. |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Backend** | Node.js, Express 5, MongoDB, Mongoose 8, Better Auth, Joi, Helmet, CORS, Morgan, Express Rate Limit |
| **Frontend** | React 19, Vite, Tailwind CSS v4, `@tanstack/react-query`, `sonner`, React Router 7, Lucide Icons |
| **Authentication** | Better Auth (Google OAuth 2.0, Email/Password with `scrypt`, HttpOnly session cookies) |
| **Deployment** | Render (Backend Web Service), Vercel (Frontend SPA) |

---

## 📁 Project Structure

```text
Mern-Production-Template/
├── package.json                           # Root scripts (concurrently dev & install)
├── .gitignore                             # Root git ignore (node_modules, .env)
├── README.md                              # Main documentation
├── FUTURE_ENHANCEMENTS.md                 # Extension guide (RBAC, S3, Email reset)
│
├── server/
│   ├── .env.example                       # Backend environment template
│   ├── package.json                       # Backend dependencies
│   ├── server.js                          # Server bootstrap, validation & graceful shutdown
│   └── src/
│       ├── app.js                         # Express setup, middlewares, routes, trust proxy
│       ├── common/
│       │   ├── config/
│       │   │   ├── auth.js                # Better Auth singleton setup (Google SSO & Email)
│       │   │   ├── db.js                  # Single Mongoose & MongoDB connection pool
│       │   │   └── env.js                 # Fail-fast Joi environment validation schema
│       │   ├── dto/
│       │   │   └── base.dto.js            # Base Joi validation class
│       │   ├── middleware/
│       │   │   ├── auth.middleware.js     # Better Auth session guard
│       │   │   ├── error.middleware.js    # Centralized error handler
│       │   │   └── validate.middleware.js # DTO request validation middleware
│       │   └── utils/
│       │       ├── api-error.js           # Standardized ApiError class
│       │       └── api-response.js        # Standardized ApiResponse helper
│       └── modules/
│           └── users/
│               ├── user.controller.js     # User route controller
│               ├── user.routes.js         # User API endpoints (/api/users)
│               └── user.service.js        # User business logic
│
└── client/
    ├── .env.example                       # Frontend environment template
    ├── package.json                       # Frontend dependencies
    ├── vercel.json                        # SPA routing rewrite rule for Vercel
    ├── vite.config.js                     # Vite build configuration
    └── src/
        ├── App.jsx                        # Root component with ErrorBoundary, QueryClient, Toaster
        ├── main.jsx                       # Entry point with BrowserRouter
        ├── index.css                      # Tailwind CSS v4 imports
        ├── components/
        │   ├── ErrorBoundary.jsx          # Fallback UI error boundary
        │   ├── Navbar.jsx                 # Dynamic header (Profile avatar, user info, Sign Out)
        │   └── ProtectedRoute.jsx         # Client-side session route guard
        ├── pages/
        │   ├── LandingPage.jsx            # Public landing page template
        │   ├── LoginPage.jsx              # Google login & Email/Password sign-in/sign-up
        │   └── DashboardPage.jsx          # Protected user dashboard
        ├── routes/
        │   └── AppRouter.jsx              # Application route tree
        ├── lib/
        │   ├── auth-client.js             # Better Auth browser client
        │   └── query-client.js            # TanStack React Query client setup
        └── services/
            └── api.js                     # Configured fetch wrapper with credentials
```

---

## 🔑 How to Obtain Environment Variables

### 1. MongoDB Atlas Connection URI (`MONGODB_URI`)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Create a free shared cluster (M0).
3. Under **Security > Database Access**:
   - Click **Add New Database User**.
   - Choose **Password** authentication, create a username/password, and grant **Read and write to any database**.
4. Under **Security > Network Access**:
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere (`0.0.0.0/0`)** so both your local machine and Render servers can connect.
5. In your cluster dashboard, click **Connect > Drivers**:
   - Copy the connection string.
   - Format:
     ```env
     MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern-template?retryWrites=true&w=majority
     ```

---

### 2. Better Auth Secret (`BETTER_AUTH_SECRET`)
Generate a secure 32-character random key:
* **Option A (Terminal command)**:
  ```bash
  openssl rand -hex 32
  ```
* **Option B (Node.js)**:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
Copy the generated string into `BETTER_AUTH_SECRET`.

---

### 3. Google OAuth Credentials (`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`)
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project (e.g. `mern-production-template`).
3. Configure the **OAuth consent screen** (**APIs & Services > OAuth consent screen**):
   - User Type: **External**.
   - App name & Developer email: Fill in your project name and email.
   - Scopes: Add `email`, `profile`, and `openid`.
   - **Test Users**: Add your own Google email address (required while the app is in "Testing" mode).
4. Create Credentials (**APIs & Services > Credentials > Create Credentials > OAuth Client ID**):
   - Application Type: **Web application**.
   - Name: `MERN Auth Client`.
   - **Authorized JavaScript origins**:
     - Local: `http://localhost:5173` and `http://localhost:5000`
     - Production: `https://<your-vercel-domain>.vercel.app` and `https://<your-render-domain>.onrender.com`
   - **Authorized redirect URIs**:
     - Local: `http://localhost:5000/api/auth/callback/google`
     - Production: `https://<your-render-domain>.onrender.com/api/auth/callback/google`
5. Click **Create** and copy your **Client ID** and **Client Secret**.

---

### 4. URL Configuration Rules

> [!IMPORTANT]
> **No Trailing Slashes**: Do not include a trailing `/` at the end of URLs (e.g., use `http://localhost:5173`, NOT `http://localhost:5173/`). Trailing slashes will cause CORS and trusted origin equality checks to fail.

* **`CLIENT_URL`**: The public URL where the frontend is hosted (e.g., `http://localhost:5173` locally, or `https://my-app.vercel.app` in production).
* **`BETTER_AUTH_URL`**: The public URL where the backend API is reachable (e.g., `http://localhost:5000` locally, or `https://my-api.onrender.com` in production).
* **`VITE_API_URL`**: The backend URL that Vite communicates with (e.g., `http://localhost:5000` locally, or `https://my-api.onrender.com` in production).

---

## 🚀 Local Development Setup

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/siddhantgorte/mern-production-template.git
cd mern-production-template

# Install root, backend, and frontend dependencies in one command:
npm run install:all
```

---

### 2. Configure Local Environment Variables

#### Backend (`server/.env`)
Create `server/.env` based on `server/.env.example`:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/mern-template?retryWrites=true&w=majority

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Better Auth
BETTER_AUTH_SECRET=your_32_character_secret_key
BETTER_AUTH_URL=http://localhost:5000

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Frontend (No trailing slash)
CLIENT_URL=http://localhost:5173
```

#### Frontend (`client/.env`)
Create `client/.env` based on `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

---

### 3. Start Development Server

Run both frontend and backend concurrently with a single command:

```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`
- **Health Check Route**: `http://localhost:5000/health`

---

## 🌐 Production Deployment Walkthrough

### 1. Backend Deployment (Render)

1. Sign in to [Render](https://render.com/) and click **New > Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `mern-production-server`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables** in the Render dashboard:
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `mongodb+srv://...`
   - `BETTER_AUTH_SECRET` = `your_32_character_secret_key`
   - `BETTER_AUTH_URL` = `https://<your-render-service>.onrender.com` *(no trailing slash)*
   - `CLIENT_URL` = `https://<your-vercel-app>.vercel.app` *(no trailing slash)*
   - `GOOGLE_CLIENT_ID` = `your_google_client_id`
   - `GOOGLE_CLIENT_SECRET` = `your_google_client_secret`
5. Click **Create Web Service**.

---

### 2. Frontend Deployment (Vercel)

1. Sign in to [Vercel](https://vercel.com/) and click **Add New > Project**.
2. Import your GitHub repository.
3. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `client`
4. Add **Environment Variables**:
   - `VITE_API_URL` = `https://<your-render-service>.onrender.com` *(no trailing slash)*
5. Click **Deploy**.

> [!NOTE]
> `VITE_API_URL` is bundled at compile time. Whenever you change environment variables in Vercel, always trigger a **Redeploy** to rebuild the frontend assets.

---

### 3. Updating Google Cloud Console for Production

Once you know your live Vercel and Render domains, go to **Google Cloud Console > Credentials > OAuth 2.0 Client IDs**:

1. **Authorized JavaScript origins**:
   - `https://<your-vercel-app>.vercel.app`
   - `https://<your-render-service>.onrender.com`
2. **Authorized redirect URIs**:
   - `https://<your-render-service>.onrender.com/api/auth/callback/google`
3. Click **Save**.

---

## 🏛️ Architecture & Request Flow

```text
1. User interacts with UI (Google Login or Email/Password Form)
   │
2. authClient makes request with credentials: "include"
   │
3. Express Server processes request via toNodeHandler(getAuth())
   │
4. Better Auth sets HttpOnly session cookie (SameSite=None; Secure in production)
   │
5. User navigates to /dashboard -> ProtectedRoute verifies session via useSession()
   │
6. Frontend fetches /api/users/me -> authMiddleware attaches verified user to req.auth
```

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Protection | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/health` | Public | Health check / server uptime status |
| `GET` | `/` | Public | Root API status confirmation |
| `ALL` | `/api/auth/*` | Public / Better Auth | Better Auth endpoints (Google SSO, Email sign-up/sign-in, sessions) |
| `GET` | `/api/users/me` | `authMiddleware` | Returns the currently authenticated user's profile |

---

## 📦 Adding New Backend Modules

To add a new feature domain (e.g. `posts`), create a folder inside `server/src/modules/posts/`:

```text
server/src/modules/posts/
├── post.model.js       # Mongoose Schema & Database Model
├── post.dto.js         # Joi validation schema extending BaseDto
├── post.service.js     # Database operations and business logic
├── post.controller.js  # Request/response handler using ApiResponse
└── post.routes.js      # Express router with authMiddleware & validate()
```

### Example Route Implementation:
```javascript
// server/src/modules/posts/post.routes.js
import { Router } from "express"
import authMiddleware from "../../common/middleware/auth.middleware.js"
import validate from "../../common/middleware/validate.middleware.js"
import { createPostDto } from "./post.dto.js"
import * as postController from "./post.controller.js"

const router = Router()

router.post("/", authMiddleware, validate(createPostDto), postController.createPost)
router.get("/", postController.getPosts)

export default router
```

Mount the new route in `server/src/app.js`:
```javascript
import postRoutes from "./modules/posts/post.routes.js"

app.use("/api/posts", postRoutes)
```

---

## 🔮 Future Enhancements & Roadmap

For advanced architectural extensions (such as Transactional Email with Resend, Role-Based Access Control, Cloud File Uploads, and Docker Compose), refer to **[FUTURE_ENHANCEMENTS.md](FUTURE_ENHANCEMENTS.md)**.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).
