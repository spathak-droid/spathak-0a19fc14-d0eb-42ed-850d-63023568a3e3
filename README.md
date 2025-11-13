# RBAC Monorepo — Full Documentation (Angular + NestJS + NX)

This repository is an **NX Monorepo** containing:

- **Frontend:** Angular (Standalone) 17*+
- **Backend:** NestJS REST API  
- **Authentication:** JWT Access Tokens  
- **RBAC:** Roles, Permissions & Organization Hierarchy  
- **Database:** SQLite

---

## ⚙️ 1. Setup Instructions

### Cloning Repository
```bash
git clone git@github.com:spathak-droid/spathak-0a19fc14-d0eb-42ed-850d-63023568a3e3.git
cd spathak-0a19fc14-d0eb-42ed-850d-63023568a3e3
```

## 🌍 2. Environment Variables

### Backend  - Add to Root folder`.env`
```
DB_TYPE=sqlite
DB_NAME=dev.sqlite
DB_LOGGING=true

#RANDOM
JWT_SECRET="YOUR_KEY" # can use random
API_URL=http://localhost:3000/api
```

### Prepare env for FE from -> This will add a file to FE in evironments
```
npm run prepare-env
```

### Install Dependencies
```bash
npm install
```


### Start Backend (NestJS)
```bash
npx nx serve api
```

### Start Frontend (Angular)
```bash
npx nx serve dashboard
```

### SAMPLE LOGIN
- james@example.com (Password - supersecure2) 👀 - VIEWER
- jane@example.com (Password - supersecure) 🏠 - OWNER
- sam@example.com (Password - supersecure) 👨‍💼 - ADMIN

---


## 🧱 3. NX Monorepo Architecture

```
root/
 ├── apps/
 │   ├── api/                 # NestJS backend (Controllers, Services)
 │   └── dashboard/           # Angular frontend
 ├── libs/
 │   ├── auth/                # JWT Strategy, Guard, AuthService
 │   ├── data/                # Shared Data of Entities
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

### Libs -> Data: Schema Overview

#### User
- id  
- name
- email  
- password  
- organizationId → many-to-one Organization  
- roleId → many-to-one Roles  
- createdAt

#### Role
- id  
- name  
- inherits_from_id → many-to-many Permissions  

#### Permission
- id  
- name  
- description

#### Organization
- id  
- name  
- description
- parentId many-to-one (self-relation)
- children[] one-to-many
(2- level hierarchy)

#### VIEWING SQLite DATA
- You can use SQLite Viewer extension
- Simply open dev.sqlite
- Or Can Download SQlite GUI and import dev.sqlite there
```
# RBAC Hierarchy Documentation

This document explains how **Roles**, **Permissions**, and **Organization Hierarchy** work together in the system.

---

## 🔐 Roles

Each **Role** represents a set of capabilities.  
Roles may optionally **inherit** permissions from another role via the `inheritsFrom` relationship.

### Role Entity Structure
```ts
id: string (uuid)
name: string
permissions: Permission[]
inheritsFrom?: Role
```

### Example Role Hierarchy
```
OWNER
 └── ADMIN
      └── MANAGER
VIEWER
```

- **OWNER** → all permissions  
- **ADMIN** → inherits OWNER or has its own set  
- **MANAGER** → inherits ADMIN  
- **VIEWER** → read‑only access

---

## 🛡️ Permissions

Permissions define *what actions* a role can perform.

### Permission Entity Structure
```ts
id: string (uuid)
name: string
description?: string
roles: Role[]
```

### Example Permissions
| Permission | Description |
|-----------|-------------|
| `user:create` | Create users |
| `user:read`   | Read users |
| `user:update` | Update users |
| `user:delete` | Delete users |
| `org:create`  | Create organizations |
| `org:read`    | Read organizations |
| `org:update`  | Update organizations |

Permissions are assigned to roles through a many‑to‑many relationship.

---

## 🏢 Organization Hierarchy

Organizations support **tree‑structured relationships** using `parentId`.

### Example
```
Acme Corp (parent)
 └── Sales Division
      └── Regional Team
```

Organizations control **data access boundaries**.  
A user belongs to **one organization**, but permissions may allow them to operate on:

- their own organization
- child organizations
- entire hierarchy (if role allows)

---

## 🔗 How Everything Works Together

1. **Permissions** define specific actions.  
2. **Roles** bundle permissions and may inherit from other roles.  
3. **Users** are assigned to:
   - a **Role**
   - an **Organization**
4. **Organization hierarchy** limits what data users can access.
5. **JWT Tokens** embed:
   - `userId`
   - `roleId`
   - `organizationId`

### Access Flow
1. User logs in → JWT issued  
2. Request hits API with JWT  
3. Guard extracts role + permissions  
4. Access is granted if:
   - user's permissions include required action  
   - user's organization scope matches the target resource  
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

# Users API Documentation

## Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| **GET** | `/users` | List all users |
| **GET** | `/users/:id` | Get single user |
| **POST** | `/users` | Create a user |
| **PUT** | `/users/:id` | Update user |
| **DELETE** | `/users/:id` | Delete user |

All requests require:

```
Authorization: Bearer <jwt_token>
```

---

## 📌 Create User — POST `/users`

### Sample Request
```json
{
  "name": "sam smith",
  "email": "sam@example.com",
  "password": "supersecure",
  "roleId": "9b8ca543-7cdd-46be-b77e-bb413473e66f",
  "organizationId": "94d42874-7662-4221-bdfa-df5ed1689cb1"
}
```

### Sample Response
```json
{
  "id": "a1c2f150-d025-4ae4-a92c-3f825be123bc",
  "name": "sam smith",
  "email": "sam@example.com",
  "roleId": "9b8ca543-7cdd-46be-b77e-bb413473e66f",
  "organizationId": "94d42874-7662-4221-bdfa-df5ed1689cb1",
  "createdAt": "2025-02-12T10:15:43.123Z"
}
```

---

## 📌 Get All Users — GET `/users`

### Sample Response
```json
[
  {
    "id": "a1c2f150-d025-4ae4-a92c-3f825be123bc",
    "name": "sam smith",
    "email": "sam@example.com",
    "role": "Admin",
    "organizationId": "94d42874-7662-4221-bdfa-df5ed1689cb1"
  },
  {
    "id": "bb40c742-fa37-4a9a-b52c-98ab7fbf12e1",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "Owner",
    "organizationId": "94d42874-7662-4221-bdfa-df5ed1689cb1"
  }
]
```

---

## 📌 Get User by ID — GET `/users/:id`

### Sample Response
```json
{
  "id": "a1c2f150-d025-4ae4-a92c-3f825be123bc",
  "name": "sam smith",
  "email": "sam@example.com",
  "roleId": "9b8ca543-7cdd-46be-b77e-bb413473e66f",
  "organizationId": "94d42874-7662-4221-bdfa-df5ed1689cb1"
}
```

---

## 📌 Update User — PUT `/users/:id`

### Sample Request
```json
{
  "name": "Samuel Smith",
  "roleId": "3b4e9803-3569-4eeb-890d-d094ab4dcd19"
}
```

### Sample Response
```json
{
  "id": "a1c2f150-d025-4ae4-a92c-3f825be123bc",
  "name": "Samuel Smith",
  "email": "sam@example.com",
  "roleId": "3b4e9803-3569-4eeb-890d-d094ab4dcd19",
  "organizationId": "94d42874-7662-4221-bdfa-df5ed1689cb1",
  "updatedAt": "2025-02-12T11:04:12.887Z"
}
```

---

## 📌 Delete User — DELETE `/users/:id`

### Sample Response
```json
{
  "success": true,
  "message": "User removed"
}
```

### Organizations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations` | List orgs |
| GET | `/organizations/:id` | Get org |
| POST | `/organizations` | Create |
| PATCH | `/organizations/:id` | Update |
| DELETE | `/organizations/:id` | Remove |
| GET | `/organizations/tree/:id` | Hierarchy tree |

# Organization API — Sample Request & Response

## 📌 Create Organization — POST `/organizations`

### **Request Body**
```json
{
  "name": "Acme Sales Division",
  "description": "Sales and Marketing Unit",
  "parentId": "d36ccb72-bf0e-4d58-83a9-156ec140880c"
}
```

### **Requires:** Bearer JWT Token  
Send request to:

```
http://localhost:3000/api/organizations
```

---

## ✅ Sample Successful Response
```json
{
  "name": "Acme Sales Division",
  "description": "Sales and Marketing Unit",
  "parent": {
    "id": "d36ccb72-bf0e-4d58-83a9-156ec140880c",
    "name": "Acme Corp",
    "description": "Main parent organization"
  },
  "id": "94d42874-7662-4221-bdfa-df5ed1689cb1"
}
```

### Permissions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/permissions` | List permissions |
| POST | `/permissions` | Create |
| PUT | `/permissions/:id` | Update |
| DELETE | `/permissions/:id` | Remove |

## ✅ Tasks

The Task entity manages individual work items, tracking status, assignment, and category.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/tasks` | List all tasks (filtered by organization/user based on context). |
| **GET** | `/tasks/:id` | Retrieve details for a single task by ID. |
| **POST** | `/tasks` | Create a new task. |
| **PUT** | `/tasks/:id` | Update an existing task by ID (e.g., change status or assignedTo). |
| **DELETE** | `/tasks/:id` | Delete a task by ID. |

### Task Model Overview (Based on TypeORM Entity)

| Field | Type | Description | Relations | Default/Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **id** | `string` | Primary key | - | `uuid` generated |
| **title** | `string` | The task name. | - | `NOT NULL` |
| **description** | `string` | Detailed description of the task. | - | `nullable: true` |
| **createdBy** | `User` | The user who created this task. | `ManyToOne` | `eager` loaded |
| **assignedTo** | `User` | The user responsible for the task. | `ManyToOne` | `eager`, `nullable: true` |
| **organization** | `Organization` | The organization the task belongs to. | `ManyToOne` | `eager` loaded |
| **category** | `string` | Classification of the task. | - | Default: `'Work'`, Options: `'Work'`, `'Personal'`, `'Other'` |
| **status** | `string` | Current state of the task. | - | Default: `'TODO'`, Options: `'TODO'`, `'IN_PROGRESS'`, `'DONE'` |
| **createdAt** | `Date` | Timestamp of creation. | - | Auto-generated |
| **updatedAt** | `Date` | Timestamp of last update. | - | Auto-generated |

---

## 🛡️ Roles

The Role entity defines user permissions, supporting a hierarchy and many-to-many relationship with Permissions.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/roles` | List all defined roles. |
| **GET** | `/roles/:id` | Retrieve details for a single role by ID, including permissions. |
| **POST** | `/roles` | Create a new role. |
| **PUT** | `/roles/:id` | Update an existing role by ID (e.g., modify permissions). |
| **DELETE** | `/roles/:id` | Delete a role by ID. |

### Role Model Overview (Based on TypeORM Entity)

| Field | Type | Description | Relations | Constraints |
| :--- | :--- | :--- | :--- | :--- |
| **id** | `string` | Primary key | - | `uuid` generated |
| **name** | `string` | Unique name of the role (e.g., 'ADMIN', 'VIEWER'). | - | `unique: true` |
| **permissions** | `Permission[]` | List of permissions granted by this role. | `ManyToMany` | Joined via `role_permissions` table |
| **inheritsFrom** | `Role` | A parent role from which permissions are inherited. | `ManyToOne` | `nullable: true`, Self-referencing |
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

## 🧪 Test Cases
- To Run test Cases on API
```
npx jest --clearCache
npx nx test api
```
- To Run test Cases on Dashboard
```
npx jest --clearCache
npx nx test dashboard
```

## ❤️ Maintainer Notes
This system is designed to be modular, scalable, and production-ready.  
Use NX generators to keep structure consistent.

---

