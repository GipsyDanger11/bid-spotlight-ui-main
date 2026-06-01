# BidLux - Premium Online Auction Platform

BidLux is a scalable full-stack auction platform built with Spring Boot and React. It features secure JWT authentication, role-based access control, and a real-time bidding system.

## 🚀 Quick Start

### 1. Prerequisites
- Java 17+
- Node.js 18+
- Maven

### 2. Run the Application
The easiest way to start the project is using the provided `start-dev.bat` script:
```bash
./start-dev.bat
```
This script will:
- Load environment variables from `.env`.
- Start the Spring Boot backend on `http://localhost:8080`.
- Start the React frontend on `http://localhost:5173`.
- Configure the H2 in-memory database automatically (no setup required).

## 🛠 Technology Stack

### Backend
- **Framework**: Spring Boot 3.x
- **Security**: Spring Security + JWT (JSON Web Tokens)
- **Database**: H2 (Development) / MySQL (Production ready)
- **API Documentation**: Swagger/OpenAPI 3.0
- **Build Tool**: Maven

### Frontend
- **Framework**: React.js with Vite
- **UI Components**: Tailwind CSS + Shadcn UI
- **State Management**: React Hooks
- **Icons**: Lucide React

## 🔐 Security Features
- **JWT Authentication**: Secure stateless authentication using tokens.
- **Password Hashing**: BCrypt hashing for secure password storage.
- **Role-Based Access Control (RBAC)**: Distinct permissions for `ADMIN`, `SELLER`, and `CUSTOMER`.
- **Input Validation**: Robust validation using Spring Validation and Zod (Frontend).

## 📖 API Documentation
The API is fully documented using Swagger. Once the backend is running, you can access the interactive documentation at:
[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

### Key Endpoints
- `POST /api/v1/users/login`: Authenticate and receive JWT.
- `POST /api/v1/users/register`: Create a new account.
- `GET /api/v1/auctions/active`: List all live auctions.
- `POST /api/v1/bids`: Place a bid (Requires JWT).

## 📈 Scalability Note (For Reviewers)

To ensure this system can handle millions of users and high-concurrency bidding, the following strategies would be implemented:

1. **Microservices Architecture**:
   - Split the monolith into services: `Auth-Service`, `Auction-Service`, `Bidding-Service`, and `Payment-Service`.
   - Use **Spring Cloud Gateway** for routing and **Eureka** for service discovery.

2. **Caching & Real-time Updates**:
   - Use **Redis** to cache active auction prices and user sessions to reduce database load.
   - Implement **WebSockets** (using Spring WebSocket) instead of polling for real-time bid updates.

3. **Database Scalability**:
   - Use **Read Replicas** for MySQL to handle heavy read traffic (listing auctions).
   - Implement **Database Sharding** for the `Bids` table if it grows too large.

4. **Load Balancing & Deployment**:
   - Use **Nginx** as a reverse proxy and load balancer.
   - Deploy using **Docker** and **Kubernetes** for auto-scaling and high availability.

## 👥 Demo Credentials
- **Admin**: `admin@bidlux.com` / `admin123`
- **Seller**: `seller@bidlux.com` / `seller123`
- **Customer**: `customer@bidlux.com` / `customer123`
