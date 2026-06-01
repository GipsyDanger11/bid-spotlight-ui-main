#!/bin/bash

echo "Starting BidLux Development Environment..."

echo ""
echo "Starting Backend (Spring Boot)..."
cd backend/demo
export DB_URL="jdbc:mysql://localhost:3306/bidlux?createDatabaseIfNotExist=true&allowPublicKeyRetrieval=true&useSSL=false&serverTimezone=UTC"
export DB_USERNAME="me"
export DB_PASSWORD="noob13"
mvn spring-boot:run &
BACKEND_PID=$!

echo ""
echo "Waiting for backend to start..."
sleep 10

echo ""
echo "Starting Frontend (React)..."
cd ../..
npm run dev &
FRONTEND_PID=$!

echo ""
echo "Both servers are starting..."
echo "Backend: http://localhost:8080"
echo "Frontend: http://localhost:5173"
echo "Database: MySQL (configure via DB_URL, DB_USERNAME, DB_PASSWORD)"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
