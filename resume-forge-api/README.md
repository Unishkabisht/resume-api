# Resume Forge API

Resume Forge is a REST API for a resume/CV builder platform, built with **Node.js** and **Express** using a clean, layered architecture (`routes → controllers → models`). It ships with a lightweight file-based JSON database, so there is no external database setup required to run or test the project.

📄 **Full API Documentation (Postman):** https://documenter.getpostman.com/view/56589047/2sBY4PNfGk

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Getting Started](#getting-started)
- [Authentication](#authentication)
- [API Reference](#api-reference)
- [Response Format](#response-format)
- [Resetting / Seeding Data](#resetting--seeding-data)
- [Testing with Postman](#testing-with-postman)
- [Project Structure](#project-structure)
- [Author](#author)

---

## Overview

Resume Forge lets a user register an account, build multiple resumes and cover letters, organize their content into structured sections (Experience, Education, Skills, Projects, etc.), save version history of a document, restore a previous version, get lightweight AI-assisted writing suggestions, and keep track of job applications tied to a specific resume — all through a clean, predictable REST API.

The project was built as part of a structured backend development course, with a strong focus on REST API design principles, separation of concerns, and consistent response conventions.

---

## Features

- **User Authentication** — Register, login, logout, and password recovery flow (forgot/reset password) using mock bearer tokens.
- **User Profile** — View, update, and delete your own account.
- **Document Management** — Full CRUD for resumes and cover letters, plus duplicate and import actions.
- **Sections & Items** — Add ordered sections (Experience, Education, Skills, Projects, Custom) to a document, each containing one or more items with flexible fields.
- **Version History** — Save a snapshot of a document at any point and restore it later.
- **Templates** — Browse publicly available resume templates.
- **AI Writing Assistance** — Improve bullet points, summaries, and general text, or apply a custom prompt to a section. Each AI action consumes a limited AI credit balance per user.
- **Job Application Tracking** — Log job applications linked to a specific resume and track their status (applied, interviewing, offered, rejected).
- **Consistent Response Shape** — Every endpoint returns a predictable `{ success, message, data }` structure.

---

## Tech Stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Runtime        | Node.js                              |
| Framework      | Express.js                           |
| Data Storage   | File-based JSON (`data.json`)        |
| Auth           | Custom mock Bearer token sessions    |
| API Testing    | Postman                              |

---

## Project Architecture

Resume Forge follows a simple **layered (MVC-style) architecture**:

```
Client (Postman / Frontend)
        │
        ▼
     Routes            → maps an HTTP method + URL to a controller
        │
        ▼
   Middlewares          → authentication & basic request validation
        │
        ▼
    Controllers          → business logic, input validation, response shaping
        │
        ▼
      Models             → reads/writes data.json (the "database")
```

Each layer has a single responsibility, which keeps the codebase easy to navigate, test, and extend — for example, the JSON file storage could be swapped for a real database later by only changing the `models/` layer.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later recommended)
- [Postman](https://www.postman.com/) (for testing the API)

### Installation

```bash
# 1. Clone or download the project, then move into it
cd resume-forge

# 2. Install dependencies
npm install

# 3. Start the server
npm start
```

The server will start at:

```
http://localhost:3000
```

All routes are prefixed with `/api`.

---

## Authentication

Resume Forge uses simple **mock Bearer tokens** (not real JWTs) to keep local testing straightforward.

1. Register a new user via `POST /api/auth/register`.
2. Log in via `POST /api/auth/login` — this returns a `token`.
3. Send that token on every protected route using the `Authorization` header:

```
Authorization: Bearer <token>
```

Public routes (no token required): `/api/auth/*` and `/api/templates/*`.
All other routes require a valid token.

---

## API Reference

The full request/response reference — including sample payloads, required fields, and error responses for every endpoint — is documented in Postman:

👉 **https://documenter.getpostman.com/view/56589047/2sBY4PNfGk**

### Quick Overview

| Resource         | Base Route                              | Description                                              | Auth Required |
|-------------------|------------------------------------------|------------------------------------------------------------|:--------------:|
| **Auth**          | `/api/auth`                              | Register, login, logout, forgot/reset password              | ❌ |
| **Users**         | `/api/users/me`                          | View, update, or delete your own profile                    | ✅ |
| **Documents**     | `/api/documents`                         | Create, read, update, delete, duplicate, and import resumes | ✅ |
| **Sections**      | `/api/documents/:id/sections`            | Manage sections and their items within a document            | ✅ |
| **Versions**      | `/api/documents/:id/versions`            | Save and restore document snapshots                          | ✅ |
| **Templates**     | `/api/templates`                         | Browse and create resume templates (list/get are public)     | Partial |
| **AI**            | `/api/ai`                                | AI-assisted writing helpers (consumes AI credits)             | ✅ |
| **Applications**  | `/api/applications`                      | Track job applications linked to a resume                     | ✅ |

---

## Response Format

Every API response follows the same consistent shape:

```json
{
  "success": true,
  "message": "Documents fetched successfully",
  "data": {}
}
```

- `success` — boolean indicating whether the request succeeded
- `message` — a short, human-readable description of the result
- `data` — the actual payload (object, array, or empty object on failure/void actions)

Error responses follow the same shape with `success: false` and an appropriate HTTP status code (`400`, `401`, `403`, `404`, or `500`).

---

## Resetting / Seeding Data

`data.json` acts as the database and is updated automatically as you use the API.

**To reset to a clean, empty state**, replace the contents of `data.json` with:

```json
{
  "users": [],
  "sessions": [],
  "passwordResets": [],
  "documents": [],
  "sections": [],
  "sectionItems": [],
  "versions": [],
  "templates": [],
  "applications": []
}
```

**To seed realistic sample data instead**, run:

```bash
npm run seed
```

---

## Testing with Postman

1. Start the server: `npm start`
2. Open the published collection docs: **https://documenter.getpostman.com/view/56589047/2sBY4PNfGk**
3. `POST http://localhost:3000/api/auth/register` with `name`, `email`, and `password` to create your first account.
4. `POST http://localhost:3000/api/auth/login` with the same credentials to receive a token.
5. Add the token to the `Authorization` header on any protected request as `Bearer <token>`.
6. All changes persist to `data.json` — open the file directly at any time to verify the data was saved correctly.

---

## Project Structure

```
resume-forge/
├── app.js                     # Entry point — starts the Express server
├── routes/
│   └── index.js                # All routes for every resource, mounted under /api
├── controllers/                # Request handling & validation, one file per resource
│   ├── authController.js
│   ├── userController.js
│   ├── documentController.js
│   ├── sectionController.js
│   ├── versionController.js
│   ├── templateController.js
│   ├── aiController.js
│   └── applicationController.js
├── models/                     # Data access layer — reads/writes data.json
│   ├── db.js
│   ├── authModel.js
│   ├── userModel.js
│   ├── documentModel.js
│   ├── sectionModel.js
│   ├── versionModel.js
│   ├── templateModel.js
│   └── applicationModel.js
├── middlewares/
│   ├── authValidator.js         # Verifies the Bearer token on protected routes
│   └── documentValidator.js     # Basic guard for document-related routes
├── data.json                    # File-based "database" (auto-updated at runtime)
├── package.json
└── README.md
```

---

## Author

Built by **Unishka Bisht** as part of a structured backend development course, focused on REST API design and layered Express architecture.