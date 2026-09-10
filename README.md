# Store Rating Platform

A full-stack web application built for the **FullStack Intern Coding Challenge**. It lets normal users discover stores and rate them from 1 to 5, lets store owners track how their store is doing, and gives a system administrator full control over users and stores from a single dashboard.

Everything runs behind one login system — what you see after signing in depends entirely on your role.

---

## Tech Stack

| Layer      | Technology                                   |
|------------|-----------------------------------------------|
| Frontend   | React (Vite)                                  |
| Backend    | Node.js + Express.js                          |
| Database   | PostgreSQL                                    |
| ORM        | Prisma                                        |
| Auth       | JWT (JSON Web Tokens) + bcrypt password hashing |

---

## Who Can Do What

### System Administrator
- Sees a dashboard with the total number of users, stores, and ratings submitted so far.
- Adds new users — normal users, admins, or store owners — by filling in Name, Email, Password, Address, and Role.
- Adds new stores and assigns them to a registered store owner.
- Views every store in a sortable, filterable table (Name, Email, Address, overall Rating).
- Views every user in a sortable, filterable table (Name, Email, Address, Role), filterable by any of those fields.
- Opens a detail view for any user — if that user is a Store Owner, their store's rating shows up too.
- Logs out whenever they're done.

### Normal User
- Signs up with Name, Email, Address, and Password.
- Logs in and can change their password afterward.
- Browses every store on the platform, and can search by store name or address.
- Each store card shows the store's name, address, its overall rating, and the rating this user personally gave it (if any).
- Rates a store from 1 to 5 with a click, and can click again anytime to change that rating.
- Logs out whenever they're done.

### Store Owner
- Logs in and can change their password.
- Has a dashboard showing everyone who has rated their store, along with the store's average rating.
- Logs out whenever they're done.

---

## Validation Rules

These are enforced on both the frontend (so users get instant feedback) and the backend (so nothing invalid ever reaches the database):

| Field    | Rule                                                              |
|----------|--------------------------------------------------------------------|
| Name     | 20–60 characters                                                   |
| Address  | Up to 400 characters                                                |
| Password | 8–16 characters, at least one uppercase letter and one special character |
| Email    | Must be a valid email format                                       |

---

## Project Structure

```
Roxiler/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma      # Database models: User, Store, Rating
│   │   └── seed.js            # Seeds an admin, a store owner, and a normal user
│   └── src/
│       ├── config/            # Prisma client setup
│       ├── controllers/       # Business logic for auth, admin, owner, stores
│       ├── middlewares/       # JWT verification + role-based access guard
│       ├── routes/            # Express route definitions
│       ├── utils/             # Shared validation + sorting helpers
│       └── index.js           # App entry point
└── frontend/
    └── src/
        ├── components/        # Reusable UI (sidebar, cards, inputs, buttons)
        ├── context/           # AuthContext — holds the logged-in user + token
        ├── pages/
        │   ├── Login.jsx / Signup.jsx
        │   └── dashboards/     # Role-specific dashboards
        └── utils/api.js       # Axios instance with the auth token attached
```

### Database Schema (at a glance)

- **User** — id, name, email, password (hashed), address, role (`ADMIN` / `NORMAL_USER` / `STORE_OWNER`)
- **Store** — id, name, email, address, linked to exactly one owner (a User with role `STORE_OWNER`)
- **Rating** — id, value (1–5), linked to one User and one Store, with a unique constraint on (user, store) so a user can only have **one** rating per store — submitting again updates it instead of creating a duplicate.

---

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- A running PostgreSQL database

### 1. Clone the repo

```bash
git clone https://github.com/ayush200545/Roxiler.git
cd Roxiler
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/` with:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/roxiler_db"
JWT_SECRET="a-long-random-secret-string"
PORT=5000
```

Push the schema to your database and seed some starter data:

```bash
npx prisma migrate dev --name init
node prisma/seed.js
```

Start the server:

```bash
npm run dev
```

The API will be running at `http://localhost:5000`.

### 3. Frontend setup

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173` (Vite's default port).

> The frontend is pre-configured to call the backend at `http://localhost:5000/api` — check `frontend/src/utils/api.js` if you run the backend on a different port.

### 4. Try it out

The seed script creates three ready-to-use accounts (all with the password `Admin@1234`):

| Role         | Email                       |
|--------------|------------------------------|
| Admin        | admin@storerating.com        |
| Store Owner  | karan@storerating.com        |
| Normal User  | rohit@storerating.com        |

You can log in with any of these right away, or sign up as a new normal user from the Signup page.

---

## API Overview

| Method | Endpoint                    | Who can access it        | What it does                             |
|--------|------------------------------|---------------------------|--------------------------------------------|
| POST   | `/api/auth/register`         | Public                    | Registers a new normal user                |
| POST   | `/api/auth/login`             | Public                    | Logs in, returns a JWT                     |
| PUT    | `/api/auth/password`          | Any logged-in user        | Updates the current user's password        |
| GET    | `/api/admin/dashboard`        | Admin                     | Total users, stores, and ratings           |
| POST   | `/api/admin/users`            | Admin                     | Creates a user (any role)                  |
| GET    | `/api/admin/users`            | Admin                     | Lists users — filterable & sortable        |
| POST   | `/api/admin/stores`           | Admin                     | Creates a store, assigns an owner          |
| GET    | `/api/admin/stores`           | Admin                     | Lists stores — filterable & sortable       |
| GET    | `/api/stores`                 | Normal User                | Lists stores with search & sort            |
| POST   | `/api/stores/:id/rate`        | Normal User                | Submits or updates a rating (1–5)          |
| GET    | `/api/owner/dashboard`        | Store Owner                | Ratings received + average rating          |

Every protected route checks the JWT (`Authorization: Bearer <token>`) and confirms the user's role before letting the request through.

---

## Notes on Implementation Choices

- Passwords are never stored in plain text — they're hashed with **bcrypt** before touching the database.
- Role checks happen on the backend, not just the UI, so there's no way to reach admin data just by guessing a URL.
- Sorting is handled server-side for database fields (name, email, address, role) and client-side for computed fields like average rating, so every listed table supports ascending/descending sort.
- A rating is stored uniquely per (user, store) pair — rating a store a second time updates the existing rating rather than creating a new row, which is what "modify your submitted rating" means in practice.

---

## License

This project was built as a coding assignment and is free to use for learning or reference purposes.
