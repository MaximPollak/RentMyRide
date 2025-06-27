# RentMyRide

**RentMyRide** is a full-stack car rental application developed for the Creative Code Lab 2.  
It allows users to browse, book, and manage car rentals. Admins can manage users, cars, and bookings.

---

## Technologies Used

**Backend**: Node.js, Express.js, MySQL, JWT, Multer, UUID  
**Frontend**: React.js, React Router, Framer Motion, Toastify, Datepicker  
**Build Tools**: Vite, React, npm

---

## Folder Structure (Simplified)
```
/backend
├── controllers/       # Handles business logic for cars, users, bookings
├── models/            # Database queries and connection logic
├── node_modules/      # Backend dependencies
├── public/            # Serves static assets (including uploaded images)
├── routes/            # Express route definitions (index, cars, users, bookings)
├── services/          # Authentication and utility logic (e.g. JWT, login, database)
├── .env               # Environment variables for DB and JWT config
├── app.js             # Main server setup and middleware
├── package.json       # Backend dependencies and scripts
└── package-lock.json  # Dependency lock file

/frontend
├── dist/              # Production build output (after `vite build`)
├── node_modules/      # Frontend dependencies
├── public/            
├── src/               # All React source files and styling - App.css
│   ├── asssets/       # Homepage picture
│   ├── components/    # Reusable components of pages (Navbar, forms, etc.)
│   └── services/      # API requests to backend
├── .env               # Vite environment variables (e.g. backend URL)
├── index.html         # Root HTML file for Vite
├── vite.config.js     # Vite project configuration
├── package.json       # Frontend dependencies and scripts
└── package-lock.json  # Dependency lock file
```
---

## Documentation

Please refer to the following files for complete project details:

- `DevDiary.md`: Daily development progress and milestones
- `Development_Documentation.md`: Hosting setup, architecture overview, and user flow
- `Instructions_for_Teacher.md`: How to start the project, database config, test credentials

---

## Local Setup

Basic startup steps:

### Backend
```bash
cd backend
npm install
node app.js
```
```bash
cd frontend
npm install
npm run dev
```

## Created by Maxim Pollák
### For the SS2025 Creative Code Lab 2 final project.