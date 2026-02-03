# Velvet Bite — Backend Server

Velvet Bite is a production-grade backend server powering a multi-role food ordering platform. It is designed with **clean architecture**, **strong domain separation**, and **scalable patterns** suitable for real-world SaaS systems.

This repository contains the **API layer**, **business logic**, **authentication**, and **data orchestration** for Customers, Providers (Kitchens), and Admins.

---

## 🧭 System Overview

Velvet Bite supports **three core user roles**:

- **Customer** — Browses meals, places orders, leaves reviews
- **Provider** — Manages kitchen profile, meals, and incoming orders
- **Admin** — Oversees platform taxonomy, users, and system health

The backend enforces **role-based behavior**, **secure mutations**, and **clean data contracts** across all layers.

---

## 🧱 Architecture

The project follows a **Modular Service-Driven Architecture** for:

- **Feature isolation** — each module owns its routes, service, validation
- **Scalability** — new domains can be added without touching core logic
- **Testability** — services are decoupled from HTTP concerns

---

## 🔐 Roles

```ts
ADMIN | PROVIDER | CUSTOMER;
```

---

## 🏪 Provider Module (Kitchen)

Providers represent independent kitchens.

### Capabilities

- Create & manage provider profile
- Toggle kitchen availability
- Create & manage meals
- Handle incoming orders

### Metrics Logic

- Provider order counts reflect **orders received**, not placed
- Revenue metrics are computed dynamically from order history

---

## 🍽️ Meal Module

Meals are owned by providers and categorized.

### Features

- Provider-only mutations
- Availability toggling
- Aggregated metrics (ratings, reviews)

### Response Enhancements

- `avgRating`
- `totalReviews`
- `_count.reviews`

All derived server-side for frontend simplicity.

---

## 📦 Order Module

Orders flow through controlled states:

```ts
PLACED → PREPARING → READY → DELIVERED
```

### Safeguards

- Providers can only mutate their own orders
- Invalid state transitions are blocked
- Financial totals are immutable post-delivery

---

## 🧾 Review Module

- Customers can review only delivered orders
- Reviews are linked to meals and providers
- Ratings are aggregated automatically

---

## 🗂️ Category Module

- Admin-only
- Central taxonomy used by meals
- Prevents deletion when in use

---

## 🛡️ Error Handling

Centralized error handling via:

- `AppError` (custom error class)
- Global error middleware

All errors follow a consistent shape:

```json
{
  "success": false,
  "message": "Readable error message"
}
```

---

## 📦 Database Layer

- **Prisma ORM**
- Strong relational modeling
- Explicit selects to avoid over-fetching

### Principles

- No `any`
- No implicit relations
- Defensive querying

---

## 🌱 Environment Variables

```
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
JWT_EXPIRES_IN=7d
```

---

## 🚀 Running Locally

```bash
npm install
npm run dev
```

Server runs at:

```
http://localhost:5000
```

---
