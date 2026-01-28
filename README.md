---
BACKEND
---

# Velvet Bite

Velvet Bite is a role-based food ordering backend built with **Node.js, Express, Prisma, PostgreSQL**, and **Better Auth**.
It supports customers, providers, and administrators with clear domain separation and scalable module design.

---

## Tech Stack and Features

- **Runtime:** Node.js + TypeScript
- **Framework:** Express
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** Better Auth (email/password)
- **Authorization:** Role-based access control
- **Migrations:** Prisma Migrate
- **Seeding:** Custom admin seed script
- **Logging:** Structured console logger

---

Each module follows a **controller → service → route** pattern.

---

## Core Concepts

### Roles

The system supports three roles:

| Role       | Description                                        |
| ---------- | -------------------------------------------------- |
| `ADMIN`    | System-level access, manages categories and orders |
| `PROVIDER` | Restaurant owner / seller                          |
| `CUSTOMER` | End user placing orders                            |

- Users default to `CUSTOMER`
- Role escalation to `PROVIDER` happens during provider onboarding
- `ADMIN` cannot be self-assigned and is seeded manually

---

## Database Schema Overview

### Key Models

- `User`
- `ProviderProfile`
- `Category`
- `Meal`
- `Order`
- `OrderItem`
- `Review`
- `Session`, `Account`, `Verification` (Better Auth)

Schemas are split across files inside `prisma/schema/` for maintainability.

---

## Authentication & Authorization

- Authentication handled entirely by **Better Auth**
- Session-based authentication
- Authorization enforced via `auth()` middleware
- `req.user` is injected automatically

Example:

```ts
auth(USER_ROLE.ADMIN);
auth(USER_ROLE.PROVIDER);
auth(USER_ROLE.CUSTOMER);
```

---

## Modules

### 1. Provider Module

Manages provider onboarding and profiles.

**Key Features**

- Create provider profile (Provider-only)
- Update own profile
- Public provider listing
- Fetch provider details

**Depends on**

- User role
- ProviderProfile model

---

### 2. Category Module

Manages food categories.

**Access Control**

- Admin-only creation and update
- Public read access

**Notes**

- No hard delete
- Uses `isActive` for visibility control

---

### 3. Meal Module

Manages meals offered by providers.

**Features**

- Provider creates and manages meals
- Public listing with pagination
- Filtering by category, provider, availability

**Pagination**

- Page / limit based
- Sortable and extensible

---

### 4. Order Module

Handles order placement and lifecycle.

**Customer**

- Place orders
- View own order history

**Provider**

- View incoming orders (by providerId)

**Admin**

- Update order status

**Constraints**

- Orders can only contain meals from **one provider**
- Order creation is transactional

---

### 5. Review Module

Handles customer reviews for meals.

**Rules**

- Only customers can review
- One review per meal per user
- Rating + optional comment

---

## API Testing Order (Recommended)

The APIs should be tested in the following order to respect **data dependencies, role boundaries, and relational integrity**.

### 1 Authentication & User Setup

**Why first:**
Every protected route depends on a valid authenticated user with a correct role.

**Test flow:**

- Sign up **Customer**
- Sign up **Provider**
- Login all users
- Verify session cookies / tokens are being set correctly

**Notes:**

- Users default to `CUSTOMER`
- Provider role becomes meaningful only after provider profile creation
- Admin is seeded separately and should already exist

### 2 Provider Module (Provider Onboarding)

**Why now:**
Meals and orders depend on `ProviderProfile`.

**Test as:** Provider user

**APIs to test:**

- Create provider profile
- Get own provider profile
- Update provider profile
- Get provider by ID (public)
- List providers (if enabled)

**Verify:**

- `ProviderProfile` is created
- Correct `userId` linkage
- Provider role is effectively usable

### 3 Category Module

**Why now:**
Meals cannot be created without valid categories.

**Test as:** Admin

**APIs to test:**

- Create category
- Update category
- Get all active categories (public)

**Verify:**

- Categories appear in Prisma Studio
- `isActive` filtering works correctly

### 4 Meal Module

**Why now:**
Orders depend on meals, and reviews depend on meals.

**Test as:** Provider (create/update), Public (read)

**APIs to test:**

- Create meal
- Update meal
- Get meal by ID
- List meals with pagination
- Filter meals by:
  - category
  - provider
  - availability

**Verify:**

- Pagination metadata (`page`, `limit`, `total`)
- Meals correctly linked to provider and category
- `isAvailable` logic works

### 5 Order Module

**Why now:**
Orders depend on meals, providers, and customers.

#### Customer Flow

**Test as:** Customer

- Place order (single provider constraint)
- Get own orders

#### Provider Flow

**Test as:** Provider

- Get incoming orders (by providerId)

#### Admin Flow

**Test as:** Admin

- Update order status

**Verify:**

- Orders are transactional
- Only one provider per order enforced
- Order status transitions work
- Order items reference correct meals

### 6 Review Module

**Why last:**
Reviews depend on meals and completed customer flows.

**Test as:** Customer

**APIs to test:**

- Create review
- Get reviews for a meal

**Verify:**

- One review per user per meal constraint
- Rating and comment persistence
- Reviews linked correctly to meals

## Final Sanity Checks

Before moving to frontend integration:

- Verify all relations in Prisma Studio
- Test role-based access denial cases
- Test invalid payloads and edge cases
- Confirm pagination consistency
- Confirm provider isolation (no cross-provider access)

---

## Admin Seeding

Admin users are created via script.

```bash
npm run seed:admin
```

The script:

- Registers admin via Better Auth
- Forces role = `ADMIN`
- Marks email as verified
- Prevents duplicate creation

Required env variables:

```
ADMIN_NAME
ADMIN_EMAIL
ADMIN_PASSWORD
BETTER_AUTH_URL
SERVER_URL
```

---

## Environment Variables

- Check .env.example

---

## Error Handling

- Centralized `AppError` class
- Consistent HTTP error responses
- Async safety via `catchAsync`

---

## Design Principles

- Clear separation of concerns
- Transaction-safe writes
- Role-first authorization
- Database-driven truth
- Scalable module boundaries

---
