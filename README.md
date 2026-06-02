# MyFutsal

MyFutsal is a futsal court booking app built with React and two small Express APIs. Users can sign up, sign in, search futsal courts by name or date, view court details, book available time slots, and manage their bookings.

## Tech Stack

- Frontend: React, Create React App, React Router, Bootstrap, PrimeReact
- Backend: Node.js, Express
- Database: MongoDB for user/auth data
- File storage: JSON files for futsal listings, timings, and bookings
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
|   |-- futsal-service/       # Search/booking/futsal API on port 5000
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
- MongoDB running locally on `mongodb://127.0.0.1:27017/myFutsal`

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

## Running the App

Start MongoDB first.

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

This service reads court data from `futsalfile.json`, booking data from `bookings.json`, and available slot data from the `Timings/` folder.

## Environment Notes

The auth service currently uses the `config` package. The default config lives at:

```text
backend/auth-service/config/default.json
```

For local development, it includes a JWT key so the app can run. For production, do not commit real secrets. Set the JWT key through environment configuration instead.

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

## Notes For Future Cleanup

- The frontend still calls fixed local API URLs like `http://127.0.0.1:5000` and `http://127.0.0.1:1000`. Moving those into environment variables would make deployment easier.
- The futsal service still stores bookings and slot availability in JSON files. A database would be safer for concurrent booking updates.
- `data-structures/` and `docs/legacy-html/` are preserved for reference, but they are not part of the runtime app.
