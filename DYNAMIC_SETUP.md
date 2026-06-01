# BidLux - Dynamic Auction Platform

## 🚀 Quick Start

### Prerequisites
- Java 17 or higher
- Maven 3.6+
- Node.js 18+
- npm or yarn

### Running the Application

#### Option 1: Using the startup scripts

**Windows:**
```bash
start-dev.bat
```

**Linux/Mac:**
```bash
./start-dev.sh
```

#### Option 2: Manual startup

**1. Start the Backend (Spring Boot):**
```bash
cd backend/demo
mvn spring-boot:run
```

**2. Start the Frontend (React):**
```bash
npm run dev
```

### Access Points
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080/api
- **Database**: MySQL (configure via environment variables)
  - `DB_URL` (default: `jdbc:mysql://localhost:3306/bidlux?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC`)
  - `DB_USERNAME` (default: `root`)
  - `DB_PASSWORD` (default: empty)

## 🗄️ Database Features

### Real-time Data
- All data is stored in MySQL
- Changes in the database immediately reflect in the UI
- Sample data is automatically seeded on startup

### Database Schema
- **Users**: Customer, Seller, Admin roles with status management
- **Auctions**: Full auction lifecycle (Pending → Active → Completed)
- **Bids**: Real-time bidding with highest bid tracking

### Sample Data
The application comes with pre-loaded sample data:
- 2 users (1 admin, 1 seller)
- 2 auctions (1 active, 1 pending)
- Categories: Watches, Jewelry

### Login Credentials
- **Admin**: admin@bidlux.com / admin123
- **Seller**: seller@bidlux.com / seller123
- **Customer**: customer@bidlux.com / customer123
- **Customer 2**: customer2@bidlux.com / customer456

## 🔄 Dynamic Features

### Real-time Updates
- **Polling**: Frontend polls for updates every 10 seconds
- **Live Bidding**: Bid amounts update in real-time
- **Status Changes**: Auction status changes reflect immediately
- **User Management**: User suspensions/activations are instant

### Interactive Features
- **Place Bids**: Real bidding with validation
- **Create Listings**: Sellers can create new auctions
- **Approve/Reject**: Admins can manage auction approvals
- **User Management**: Suspend/activate users
- **Search & Filter**: Real-time search across all data

## 🛠️ API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `POST /api/users` - Create user
- `PUT /api/users/{id}` - Update user
- `PUT /api/users/{id}/suspend` - Suspend user
- `PUT /api/users/{id}/activate` - Activate user

### Auctions
- `GET /api/auctions` - Get all auctions
- `GET /api/auctions/active` - Get active auctions
- `GET /api/auctions/pending` - Get pending auctions
- `POST /api/auctions` - Create auction
- `PUT /api/auctions/{id}/approve` - Approve auction
- `PUT /api/auctions/{id}/reject` - Reject auction

### Bids
- `POST /api/bids` - Place a bid
- `GET /api/bids/auction/{id}` - Get bids for auction
- `GET /api/bids/bidder/{id}` - Get bids by user

## 🎯 Testing the Dynamic Features

### 1. Test Real-time Bidding
1. Open Customer dashboard
2. Place a bid on any auction
3. Watch the current bid update immediately
4. Check the database console to see the bid record

### 2. Test Auction Management
1. Go to Admin → Manage Auctions
2. Approve/reject pending auctions
3. See status changes in real-time
4. Check seller dashboard for updates

### 3. Test User Management
1. Go to Admin → Manage Users
2. Suspend/activate users
3. See status changes immediately
4. Check user listings for updates

### 4. Test New Listings
1. Go to Seller → New Listing
2. Create a new auction
3. Check Admin → Manage Auctions for pending approval
4. Approve the auction and see it appear in Customer dashboard

## 🔧 Development Notes

### Database Reset
The H2 database resets on every restart, so sample data is re-seeded automatically.

### CORS Configuration
Backend is configured to allow requests from `http://localhost:5173`.

### Error Handling
- Frontend shows user-friendly error messages
- Backend logs detailed error information
- API responses include proper HTTP status codes

### Performance
- Polling interval is set to 10 seconds for optimal performance
- Database queries are optimized with proper indexing
- Frontend uses React Query for efficient data management

## 🚀 Production Deployment

For production deployment, consider:
1. Harden MySQL credentials and networking
2. Add proper authentication (JWT)
3. Implement WebSocket for real-time updates
4. Add payment integration
5. Set up proper logging and monitoring
6. Configure production CORS settings
7. Add input validation and security measures

## 📝 Troubleshooting

### Backend won't start
- Check Java version (needs Java 17+)
- Check if port 8080 is available
- Run `mvn clean install` in backend/demo

### Frontend won't start
- Check Node.js version (needs 18+)
- Run `npm install` to install dependencies
- Check if port 5173 is available

### API calls failing
- Ensure backend is running on port 8080
- Check browser console for CORS errors
- Verify API endpoints in Network tab

### Database issues
- Access H2 console to check data
- Restart backend to reset database
- Check application logs for SQL errors
