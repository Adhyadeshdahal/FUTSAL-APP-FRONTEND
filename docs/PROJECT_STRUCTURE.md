# Project Structure

```text
FUTSAL-APP-FRONTEND/
├── backend/
│   ├── auth-service/        # Express auth/user/avatar API on port 1000
│   │   ├── config/
│   │   ├── src/
│   │   │   ├── index.js
│   │   │   ├── middleware/
│   │   │   ├── models/
│   │   │   └── routes/
│   │   └── uploads/
│   ├── futsal-service/      # Express futsal search/booking API on port 5000
│   │   └── src/
│   └── package.json
├── frontend/                # Create React App frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── features/
│       └── pages/
├── data-structures/         # Older standalone DSA experiments/reference code
└── docs/
    └── legacy-html/         # Old static HTML experiments removed from runtime folders
```

## Run Locally

Install dependencies separately:

```bash
cd frontend
npm install
npm start
```

```bash
cd backend
npm install
npm run start:auth
npm run start:futsal
```
