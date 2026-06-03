# MyFutsal

MyFutsal is a full-stack futsal court booking app built with React and two Express APIs. Users can sign up, sign in, search futsal courts by name or available date, view court details, reserve time slots, and manage their bookings.

## Tech Stack

- Frontend: React, Create React App, React Router, Bootstrap, PrimeReact
- Backend: Node.js, Express
- Database: MongoDB for user/auth data, MySQL for futsal courts, time slots, and bookings
- Seed data: JSON files are kept only for initial MySQL seeding
- Auth: JWT stored by the frontend and sent with `x-auth-token`

## Project Structure

```text
FUTSAL-APP-FRONTEND/
|-- frontend/                 # React client app
|   |-- public/               # Static images, video, manifest, index.html
|   `-- src/
|       |-- assets/           # Imported React assets
|       |-- components/       # Shared UI components
|       |-- features/auth/    # Login, sign in, sign up UI
|       `-- pages/            # Main app pages
|-- backend/
|   |-- auth-service/         # Auth/user/avatar API on port 1000
|   |-- futsal-service/       # MySQL-backed search/booking/futsal API on port 5000
|   `-- package.json          # Backend scripts and dependencies
|-- data-structures/          # Older standalone DSA reference code
|-- docs/
|   |-- PROJECT_STRUCTURE.md
|   `-- legacy-html/          # Old static HTML experiments
`-- README.md
```

## Prerequisites

Install these before running the project:

- Node.js and npm
- MongoDB running locally or hosted
- MySQL running locally or hosted

## Setup

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

Create local environment files:

```bash
cd backend
cp .env.example .env
```

```bash
cd frontend
cp .env.example .env
```

Update `backend/.env` with your MongoDB, MySQL, JWT, and frontend URL values. Update `frontend/.env` with the public URLs for your backend APIs.

Create and seed the MySQL database:

```bash
cd backend
npm run seed:mysql
```

## Running the App

Start MongoDB and MySQL first.

Start the auth service:

```bash
cd backend
npm run start:auth
```

The auth API runs on:

```text
http://localhost:1000
```

Start the futsal service in a second terminal:

```bash
cd backend
npm run start:futsal
```

The futsal API runs on:

```text
http://localhost:5000
```

Start the React app in a third terminal:

```bash
cd frontend
npm start
```

The frontend usually runs on:

```text
http://localhost:3000
```

## Backend Services

### Auth Service

Location:

```text
backend/auth-service/
```

Main file:

```text
backend/auth-service/src/index.js
```

Endpoints used by the frontend:

- `POST /api/register`
- `POST /api/auth`
- `GET /me`
- `GET /me/avatar/:userId`

This service connects to MongoDB and stores registered users. Uploaded avatars are saved under `backend/auth-service/uploads/`.

### Futsal Service

Location:

```text
backend/futsal-service/
```

Main file:

```text
backend/futsal-service/src/index.js
```

Endpoints used by the frontend:

- `GET /searchByName/:name`
- `GET /searchByDate/:date`
- `GET /futsals`
- `GET /futsals/:id`
- `GET /futsals/Timings/:futsalId/:date`
- `GET /Bookings/myBookings`
- `POST /Bookings/myBookings`
- `DELETE /Bookings/myBookings/:bookingId`

This service stores court data, available slots, and bookings in MySQL. The old JSON files are used only by the seed script.

## Environment Notes

Backend environment variables live in `backend/.env`:

- `FRONTEND_URL`
- `JWT_PRIVATE_KEY`
- `MONGO_URI`
- `MYSQL_HOST`
- `MYSQL_PORT`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `AUTH_SERVICE_PORT`
- `FUTSAL_SERVICE_PORT`

Frontend environment variables live in `frontend/.env`:

- `REACT_APP_AUTH_API_URL`
- `REACT_APP_FUTSAL_API_URL`

For production, do not commit real secrets. Use your hosting provider's environment variable manager.

## Useful Commands

Build the frontend:

```bash
cd frontend
npm run build
```

Run frontend tests:

```bash
cd frontend
npm test
```

Start backend services:

```bash
cd backend
npm run start:auth
npm run start:futsal
```

Seed MySQL:

```bash
cd backend
npm run seed:mysql
```

## Publishing / Deployment

For deployment, host the three runtime parts separately or as two backend services plus one static frontend:

- Frontend: build with `npm run build` inside `frontend/` and deploy the generated `frontend/build/` folder to Netlify, Vercel, Render Static Sites, S3, or any static host.
- Auth API: deploy `backend/auth-service/src/index.js` as a Node service and set `MONGO_URI`, `JWT_PRIVATE_KEY`, `FRONTEND_URL`, and `AUTH_SERVICE_PORT`.
- Futsal API: deploy `backend/futsal-service/src/index.js` as a Node service and set MySQL variables, `JWT_PRIVATE_KEY`, `FRONTEND_URL`, and `FUTSAL_SERVICE_PORT`.
- Database: use a hosted MongoDB provider for auth data and a hosted MySQL provider for futsal bookings.
- Frontend API URLs: set `REACT_APP_AUTH_API_URL` and `REACT_APP_FUTSAL_API_URL` before building the frontend.

## Notes For Future Cleanup

- Upgrade `multer` to v2 and resolve npm audit findings before production use.
- `data-structures/` and `docs/legacy-html/` are preserved for reference, but they are not part of the runtime app.
