# BidLux: Full-Stack Auction Platform Documentation

## 1. Project Overview

BidLux is a comprehensive online auction platform that enables users to participate in real-time bidding, manage auction listings, and handle user transactions securely. The platform is built using modern web technologies with React on the frontend and Spring Boot powering the backend infrastructure.

### Technology Stack
- Frontend: React with TypeScript
- Backend: Spring Boot
- Database: MySQL
- Key Frameworks: Spring Web, Spring Data JPA, Lombok
- Additional Tools: Tailwind CSS, Vite

### Key Features
- Real-time auction bidding
- User role management (Admin, Seller, Customer)
- Secure authentication system
- Auction listing management
- Transaction tracking
- Analytics and reporting

## 2. Frontend (React) Explanation

### Structure and Organization

The frontend is organized in a modular structure under the /src directory:

#### Core Files
- `main.tsx`: Application entry point that renders the root React component
- `App.tsx`: Main component containing routing logic and layout structure
- `index.css`: Global styles using Tailwind CSS
- `vite-env.d.ts`: TypeScript declarations for Vite

#### Key Directories

1. /pages/
   - `Login.tsx`: Authentication interface
   - `Customer.tsx`: Customer dashboard showing active auctions
   - `Seller.tsx`: Seller interface for managing listings
   - `Admin.tsx`: Administrative control panel
   - `ManageUsers.tsx`: User management interface
   - `ManageAuctions.tsx`: Auction management system
   - `NewListing.tsx`: Creation of new auction listings
   - `PastAuctions.tsx`: Historical auction view
   - `ViewReports.tsx`: Analytics dashboard

2. /components/ui/
   - Reusable UI components (buttons, forms, tables, etc.)
   - Styled using Tailwind CSS
   - Components follow atomic design principles

3. /services/
   - `api.ts`: Centralized API communication
   - HTTP request handling
   - Response parsing and error handling

4. /hooks/
   - Custom React hooks for shared functionality
   - `usePolling.ts`: Real-time data updates
   - `use-mobile.tsx`: Responsive design handling
   - `use-toast.ts`: Notification system

### State Management
- Local component state using useState
- Context API for global state management
- Real-time updates through polling mechanisms

### API Communication
- Axios for HTTP requests
- Centralized API service
- Error handling and response interceptors

## 3. Backend (Spring Boot) Explanation

### Core Components

#### Controllers
Located in `backend/demo/src/main/java/com/example/demo/controller/`:
- `AuthController`: Handles authentication and authorization
- `AuctionController`: Manages auction operations
- `UserController`: User management endpoints
- `BidController`: Processes bidding operations

#### Services
Business logic implementation:
- `AuctionService`: Auction management logic
- `UserService`: User operations
- `BidService`: Bid processing and validation

#### Repositories
Database interaction through JPA:
- `AuctionRepository`: Auction data access
- `UserRepository`: User data management
- `BidRepository`: Bid record handling

#### Models
Entity definitions with Lombok:
- `User.java`: User information
- `Auction.java`: Auction details
- `Bid.java`: Bid records
- `Report.java`: Analytics data

### Key Features
1. Authentication
   - JWT token-based authentication
   - Role-based access control
   - Session management

2. Data Processing
   - Request validation
   - Business logic implementation
   - Response formatting

## 4. Database Layer

### MySQL Database Configuration
```properties
spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/bidlux?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC}
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
```

### Entity Relationships
- One-to-Many: User to Auctions
- Many-to-One: Bids to Auction
- Many-to-Many: Users to Roles

### Data Access
- JPA Repositories
- Custom queries
- Transaction management

## 5. Frontend-Backend Connection

### API Endpoints

#### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/refresh

#### Auctions
- GET /api/auctions
- POST /api/auctions
- PUT /api/auctions/{id}
- DELETE /api/auctions/{id}

#### Users
- GET /api/users
- POST /api/users
- PUT /api/users/{id}
- DELETE /api/users/{id}

### CORS Configuration
```java
@Configuration
public class CorsConfig {
    @Bean
    public CorsFilter corsFilter() {
        // Configuration for local development
    }
}
```

## 6. Application Flow

### Startup Process
1. Backend initialization
   - Spring Boot application starts
   - Database connection established
   - Controllers registered

2. Frontend initialization
   - React application loads
   - Routes configured
   - Initial API calls made

### Request Flow
1. User interaction triggers React event
2. Frontend sends HTTP request
3. Spring Boot controller receives request
4. Service layer processes business logic
5. Database operation performed
6. Response returned to frontend
7. React updates UI with new data

## 7. Dependencies

### Backend (pom.xml)
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- h2
- lombok
- jjwt

### Frontend (package.json)
- react
- react-dom
- typescript
- tailwindcss
- axios
- vite

## 8. Running the Project

### Prerequisites
- Java 11 or higher
- Node.js 14 or higher
- npm or yarn

### Starting the Application
1. Backend:
   ```bash
   cd backend/demo
   ./mvnw spring-boot:run
   ```

2. Frontend:
   ```bash
   npm install
   npm run dev
   ```

### Access Points
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
 

## 9. Summary

BidLux demonstrates a modern full-stack application architecture:
- React frontend provides responsive and interactive user interface
- Spring Boot backend ensures robust API and business logic handling
- MySQL database offers reliable data persistence
- Integration of modern tools and practices for efficient development

The system's modular design allows for:
- Easy maintenance and updates
- Scalable architecture
- Secure user authentication
- Real-time data processing
- Comprehensive auction management

This documentation provides an overview of the technical implementation while maintaining focus on the business goals of creating a reliable and user-friendly auction platform.