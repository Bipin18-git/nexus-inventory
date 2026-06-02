# 🚀 Nexus OS | Enterprise Inventory & Order Management

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=for-the-badge&logo=vercel)

A highly optimized, full-stack, and fully containerized Inventory and Order Management System. Designed strictly according to the assessment instructions, it enforces business constraints (inventory validation, unique SKUs, automated stock deductions) while providing a seamless, responsive user experience.

---

## 🌍 Live Environments & Links
> **Note to Evaluator:** The backend is hosted on a free Render instance. It spins down after inactivity, so the **very first API call might take 30-50 seconds** to wake up.

- **Frontend Application:** [https://nexus-inventory-orcin.vercel.app/](https://nexus-inventory-orcin.vercel.app/)
- **Backend API (Swagger UI):** [https://nexus-inventory-7t9p.onrender.com/docs](https://nexus-inventory-7t9p.onrender.com/docs)
- **GitHub Repository:** [https://github.com/Bipin18-git/nexus-inventory](https://github.com/Bipin18-git/nexus-inventory)
- **Docker Image Setup:** Handled natively via the provided `docker-compose.yml` (multi-container orchestrated setup).

---

## ✨ Implemented Business Rules & Constraints
1. **Product Management:** Enforces **Unique SKUs**. Attempting to add a duplicate SKU returns a structured HTTP 400 error.
2. **Customer Directory:** Enforces **Unique Email Addresses** per customer.
3. **Inventory Validation:** Orders cannot be placed if the requested quantity exceeds the available `stock_quantity`.
4. **Automated Stock Reduction:** Upon a successful order transaction, the product's stock is automatically and transactionally reduced in the database.

---

## 🏗️ System Architecture & Tech Stack

- **Frontend:** React (Vite) + Tailwind CSS (Glassmorphism, Custom Toast Notifications, Responsive Tables).
- **Backend:** Python + FastAPI (Async routes, Pydantic for strict data validation).
- **Database:** PostgreSQL (Relational integrity, SQLAlchemy ORM).
- **Infrastructure:** Docker & Docker Compose (Isolated environments, internal Docker bridge network).
- **Security:** Zero hardcoded credentials. All secrets are managed via Environment Variables.

---

## 🗄️ Database Schema Overview
The PostgreSQL database consists of 3 relational tables:
- `products`: `id` (PK), `sku` (Unique), `name`, `price`, `stock_quantity`.
- `customers`: `id` (PK), `name`, `email` (Unique).
- `orders`: `id` (PK), `customer_id` (FK), `product_id` (FK), `quantity`, `order_date`.

---

## 💻 Local Developer Setup (Docker)

Running this project locally requires zero manual configuration of databases or environments. 

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop) installed and running.

### 1. Clone the repository
```bash
git clone [https://github.com/Bipin18-git/nexus-inventory.git](https://github.com/Bipin18-git/nexus-inventory.git)
cd nexus-inventory
