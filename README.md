# RBAC Monorepo — Full Documentation (Angular + NestJS + NX)

This repository is an **NX Monorepo** containing:

- **Frontend:** Angular (Standalone)
- **Backend:** NestJS REST API  
- **Authentication:** JWT Access Tokens  
- **RBAC:** Roles, Permissions & Organization Hierarchy  
- **Database:** SQLite

---

## ⚙️ 1. Setup Instructions

### Install Dependencies
```bash
npm install
```

### Start PostgreSQL (Docker)
```bash
docker compose up -d
```

### Start Backend (NestJS)
```bash
npx nx serve api
```

### Start Frontend (Angular)
```bash
npx nx serve dashboard
```

---

## 🌍 2. Environment Variables

### Backend `.env` — `/apps/api/.env`
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/rbac_db"
JWT_SECRET="supersecretjwt"
JWT_EXPIRES_IN="1d"
PORT=3000
```

### Frontend `.env` — `/apps/dashboard/.env`
```
API_URL="http://localhost:3000"
```

---

## 🧱 3. NX Monorepo Architecture

```
root/
 ├── apps/
 │   ├── api/                 # NestJS backend
 │   └── dashboard/           # Angular frontend
 ├── libs/
 │   ├── auth/                # JWT Strategy, Guard, AuthService
 │   ├── models/              # Prisma-generated types
 │   └── utils/               # Shared helpers
 ├── prisma/
 │   └── schema.prisma        # Main DB schema
 ├── package.json
 ├── nx.json
 └── README.md
```

### Why NX?
- Modular code sharing between FE/BE  
- Dependency graph ensures architecture correctness  
- Smart caching for fast builds/tests  
- CLI tools for modern monorepo management  

---

## 🗄️ 4. Data Model Explanation

### Prisma Schema Overview

#### User
- id  
- email  
- password  
- orgId → Organization  
- roles → many-to-many Roles  

#### Role
- id  
- name  
- permissions → many-to-many Permissions  

#### Permission
- id  
- name  

#### Organization
- id  
- name  
- parentId (self-relation)
- children[]  

---

## 🔐 5. Access Control Implementation

### JWT Authentication Flow
1. User logs in with email & password  
2. Backend validates credentials  
3. Backend issues **JWT Access Token**  
4. Angular stores token in localStorage  
5. Every request includes `Authorization: Bearer <token>`  

### Role & Permission Model
- Roles group permissions  
- Users can have multiple roles  
- Users belong to organizations  
- Permissions flow downward through organization tree  

### Organization Hierarchy + RBAC
- Each organization can have child organizations  
- Users inherit effective permissions based on:
  - Their roles  
  - Their organization’s roles  
  - Their ancestors’ roles  

### Guards
- `JwtAuthGuard`: validates JWT  
- `RolesGuard`: checks user role permissions  

---

## 📡 6. API Documentation

Base URL:
```
http://localhost:3000/api
```

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login & get JWT |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List users |
| GET | `/users/:id` | Get user |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update |
| DELETE | `/users/:id` | Remove |

### Organizations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations` | List orgs |
| GET | `/organizations/:id` | Get org |
| POST | `/organizations` | Create |
| PATCH | `/organizations/:id` | Update |
| DELETE | `/organizations/:id` | Remove |
| GET | `/organizations/tree/:id` | Hierarchy tree |

### Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/permissions` | List permissions |
| POST | `/permissions` | Create |
| PUT | `/permissions/:id` | Update |
| DELETE | `/permissions/:id` | Remove |

---

## 🚀 7. Future Considerations

### Advanced Role Delegation
- Grant temporary permissions  
- Granular scoping of permissions  

### Production Security
- JWT **refresh tokens**  
- CSRF protection  
- HTTP-only cookies  
- Rate limiting  
- IP throttling  

### Scaling Authorization
- Permission caching (Redis)  
- Pre-computed effective permissions  
- Audit logs for role changes  

---

## ❤️ Maintainer Notes
This system is designed to be modular, scalable, and production-ready.  
Use NX generators to keep structure consistent.

---

