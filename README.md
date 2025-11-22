# Email Client - Frontend

A modern, feature-rich email client built with React, TypeScript, and Tailwind CSS. Ready for MariaDB backend integration.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Backend API (MariaDB)

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd email-client

# Install dependencies
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:3001" > .env

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

## 📋 Documentation

### For Backend Integration
- **[BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)** - Complete API specifications and setup
- **[API_ENDPOINTS_REFERENCE.md](./API_ENDPOINTS_REFERENCE.md)** - Quick API endpoint reference
- **[SETUP_FOR_BACKEND.md](./SETUP_FOR_BACKEND.md)** - Step-by-step setup instructions

### Project Information
- **[CLEANUP_SUMMARY.md](./CLEANUP_SUMMARY.md)** - Summary of changes made
- **[GITHUB_READY_CHECKLIST.md](./GITHUB_READY_CHECKLIST.md)** - Deployment checklist

## ✨ Features

### Email Management
- 📧 **Compose & Send** - Write and send emails with rich formatting
- 📁 **Folder Management** - Organize emails in custom folders
- 🔄 **Email Threading** - Gmail-style conversation threading
- ⭐ **Star Emails** - Mark important emails
- 📖 **Read Status** - Track read/unread emails
- 🗑️ **Trash & Spam** - Manage unwanted emails

### User Experience
- 🌙 **Dark Mode** - Beautiful dark theme support
- 🌍 **IST Timezone** - Proper timezone formatting for India
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Performance** - Optimized React components

### Advanced Features
- 🎮 **Gamification** - Carbon credit system for eco-friendly emailing
- 🔗 **P2P Distribution** - Peer-to-peer email sharing
- 🔐 **Authentication** - Secure user login and registration
- 🔍 **Search** - Find emails quickly

## 🏗️ Project Structure

```
src/
├── components/
│   ├── MailLayout.tsx          # Main layout component
│   ├── EmailList.tsx           # Email list view
│   ├── EmailView.tsx           # Single email view
│   ├── ThreadView.tsx          # Email threading view
│   ├── ComposeEmail.tsx        # Compose interface
│   ├── GamificationBadges.tsx  # Carbon credits display
│   ├── UserProfile.tsx         # User profile page
│   └── ...
├── lib/
│   ├── authService.ts          # Authentication (needs backend)
│   ├── emailService.ts         # Email operations (needs backend)
│   ├── carbonService.ts        # Carbon credit calculations
│   ├── threadingService.ts     # Email threading logic
│   ├── p2pService.ts           # P2P distribution
│   └── ...
├── contexts/
│   └── AuthContext.tsx         # Auth state management
├── App.tsx                      # Main app component
└── index.css                    # Global styles
```

## 🔧 Configuration

### Environment Variables

Create `.env` file in project root:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3001

# For production
# VITE_API_BASE_URL=https://your-backend-domain.com
```

## 🔌 Backend Integration

### Fake Database Files Removed ✅

All fake database dependencies have been deleted:
- ✅ `src/lib/database.ts` - Fake IndexedDB (DELETED)
- ✅ `src/lib/dummyData.ts` - Test data (DELETED)
- ✅ `src/lib/supabase.ts` - Supabase config (DELETED)

### Services to Update

1. **authService.ts** - Replace with actual API calls
   - User registration
   - User login
   - Profile retrieval
   - Logout

2. **emailService.ts** - Replace with actual API calls
   - Create/send emails
   - Get emails
   - Update emails
   - Delete emails
   - Manage folders

See [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md) for complete examples.

### API Endpoints

All endpoints documented in [API_ENDPOINTS_REFERENCE.md](./API_ENDPOINTS_REFERENCE.md)

**Base URL:** `http://localhost:3001/api`

**Auth Endpoints:**
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/profile` - Get user profile
- `POST /auth/logout` - Logout user

**Email Endpoints:**
- `POST /emails` - Create email
- `GET /emails` - Get all emails
- `GET /emails/{id}` - Get single email
- `PUT /emails/{id}` - Update email
- `DELETE /emails/{id}` - Delete email

**Folder Endpoints:**
- `GET /folders` - Get all folders
- `POST /folders` - Create folder
- `PUT /folders/{id}` - Update folder
- `DELETE /folders/{id}` - Delete folder

## 🗄️ Database Schema

MariaDB schema provided in [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)

**Tables:**
- `users` - User accounts
- `emails` - Email messages
- `folders` - Email folders

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Type check
npm run typecheck
```

## 📦 Dependencies

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build tool

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory

### Deploy To

- **Vercel** - Recommended for React apps
- **Netlify** - Easy deployment
- **GitHub Pages** - Free static hosting
- **AWS S3 + CloudFront** - Scalable solution
- **Any static hosting** - Works anywhere

## 🔐 Security Notes

- Store JWT tokens securely in localStorage
- Use HTTPS in production
- Implement CORS properly on backend
- Validate all inputs on backend
- Use environment variables for sensitive data

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### CORS errors
- Check backend CORS configuration
- Verify `VITE_API_BASE_URL` is correct
- Ensure backend is running

### Authentication issues
- Verify JWT token in localStorage
- Check token expiration
- Verify backend authentication

### Emails not loading
- Check browser console for errors
- Verify backend is running
- Check API endpoint responses

## 📚 Learning Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)

## 👥 Team Setup

### For Backend Developer

1. Read [BACKEND_INTEGRATION_GUIDE.md](./BACKEND_INTEGRATION_GUIDE.md)
2. Set up MariaDB database
3. Implement REST API endpoints
4. Test with frontend

### For Frontend Developer

1. Clone repository
2. Run `npm install`
3. Create `.env` file
4. Run `npm run dev`
5. Update service files when backend is ready

## 📝 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Support

For questions or issues:
1. Check documentation files
2. Review component source code
3. Check browser console for errors

## ✅ Status

- ✅ Frontend complete and production-ready
- ✅ All UI/UX features implemented
- ✅ Dark mode support
- ✅ IST timezone configured
- ✅ Email threading implemented
- ⏳ Awaiting backend integration

## 🎯 Next Steps

1. Backend developer creates MariaDB database
2. Backend developer implements API endpoints
3. Frontend developer updates service files
4. Test integration
5. Deploy to production

---

**Ready to integrate with MariaDB backend!** 🚀
