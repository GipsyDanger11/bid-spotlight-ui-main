@echo off
echo Starting BidLux Frontend (Demo Mode)...
echo.
echo This will run the frontend with demo data.
echo No backend required - perfect for testing UI!
echo.

echo Starting Frontend (React)...
start "Frontend" cmd /k "npm run dev"

echo.
echo Frontend is starting...
echo Frontend: http://localhost:5173
echo.
echo Login Credentials:
echo - Admin: admin@bidlux.com / admin123
echo - Seller: seller@bidlux.com / seller123  
echo - Customer: customer@bidlux.com / customer123
echo.
echo Press any key to exit...
pause > nul
