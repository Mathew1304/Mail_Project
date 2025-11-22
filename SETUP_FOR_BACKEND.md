# Email Client - Frontend Setup for MariaDB Backend

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Backend API running (MariaDB)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd email-client

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:3001" > .env

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## What's Been Removed

✅ **Deleted all fake database files:**
- ✅ `src/lib/database.ts` - Fake IndexedDB (DELETED)
- ✅ `src/lib/dummyData.ts` - Test data (DELETED)
- ✅ `src/lib/supabase.ts` - Supabase config (DELETED)

✅ **Removed dummy data initialization** from `MailLayout.tsx`

✅ **Ready for MariaDB backend integration:**
- `src/lib/authService.ts` - Needs backend API calls
- `src/lib/emailService.ts` - Needs backend API calls

## What You Need to Do (Backend)

### 1. Create MariaDB Database
Use the schema provided in `BACKEND_INTEGRATION_GUIDE.md`

### 2. Implement REST API Endpoints
Follow the endpoint specifications in `BACKEND_INTEGRATION_GUIDE.md`

### 3. Update Frontend Service Files
Replace the service implementations with actual API calls (examples provided in guide)

### 4. Set Environment Variables
```
VITE_API_BASE_URL=http://your-backend-url:port
```

## Project Structure

```
src/
├── components/          # React components
│   ├── MailLayout.tsx   # Main layout
│   ├── EmailList.tsx    # Email list view
│   ├── EmailView.tsx    # Single email view
│   ├── ThreadView.tsx   # Gmail-style threading
│   ├── ComposeEmail.tsx # Compose interface
│   └── ...
├── lib/
│   ├── authService.ts   # Auth API calls (to implement)
│   ├── emailService.ts  # Email API calls (to implement)
│   ├── carbonService.ts # Carbon credit calculations
│   ├── threadingService.ts # Email threading logic
│   └── p2pService.ts    # P2P distribution
├── contexts/
│   └── AuthContext.tsx  # Auth state management
└── App.tsx              # Main app component
```

## Key Features

- 📧 Email composition and sending
- 📁 Folder management
- 🔄 Gmail-style email threading
- ⭐ Star/unstar emails
- 📖 Mark as read/unread
- 🌙 Dark mode
- 🌍 IST timezone support
- 🎮 Carbon credit gamification
- 🔗 P2P email distribution

## API Integration Checklist

- [ ] Implement user registration endpoint
- [ ] Implement user login endpoint
- [ ] Implement get profile endpoint
- [ ] Implement create email endpoint
- [ ] Implement get emails endpoint
- [ ] Implement update email endpoint
- [ ] Implement delete email endpoint
- [ ] Implement get folders endpoint
- [ ] Implement create folder endpoint
- [ ] Implement update folder endpoint
- [ ] Implement delete folder endpoint
- [ ] Test all endpoints with frontend

## Troubleshooting

### "Cannot find module" errors
- Run `npm install` to ensure all dependencies are installed

### CORS errors
- Ensure backend has CORS enabled for frontend domain
- Check `VITE_API_BASE_URL` in `.env`

### Authentication issues
- Verify JWT token is being stored in localStorage
- Check token expiration handling

### Email not loading
- Verify backend is running
- Check browser console for API errors
- Verify user_id is being passed correctly

## Support

For detailed API specifications, see `BACKEND_INTEGRATION_GUIDE.md`

## Build for Production

```bash
npm run build
```

Output will be in `dist/` directory
