# 🚀 Quick Start Guide

## Issues Fixed ✅

1. **Customer page showing only background** - Added fallback demo data
2. **New listing image upload** - Added emoji image picker
3. **Backend connection issues** - Added graceful fallbacks

## 🎯 How to Run

### **Option 1: Frontend Only (Demo Mode)**
```bash
npm run dev
```
- Open http://localhost:5173
- All pages will show demo data
- Perfect for testing UI without backend

### **Option 2: Full Stack (Live Data)**
```bash
# Terminal 1 - Backend
cd backend/demo
./mvnw.cmd spring-boot:run

# Terminal 2 - Frontend  
npm run dev
```

## 🔑 Login Credentials

- **Admin**: admin@bidlux.com / admin123
- **Seller**: seller@bidlux.com / seller123  
- **Customer**: customer@bidlux.com / customer123
- **Customer 2**: customer2@bidlux.com / customer456

## ✨ New Features

### **Image Selection in New Listing**
- Click on emoji icons to select item image
- 12 different category options
- Visual preview of selected image
- No file upload needed - uses emojis

### **Fallback Data**
- Works without backend running
- Shows demo auctions and users
- Graceful error handling
- Toast notifications for status

## 🎮 Test the Features

1. **Customer Dashboard**: See demo auctions, place bids
2. **Seller Dashboard**: View listings, create new ones
3. **Admin Dashboard**: Manage users and auctions
4. **New Listing**: Select images, create auctions

## 🔧 Troubleshooting

**If you see only background:**
- Check browser console for errors
- Try refreshing the page
- Demo data should load automatically

**If image picker doesn't work:**
- Make sure you're on the New Listing page
- Click on any emoji to select it
- Selected image will show at the top

**For live data:**
- Start backend first, then frontend
- Check http://localhost:8080/h2-console for database
- API calls will work with backend running
