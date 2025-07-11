
# Elden Sports Fields

Real-time sports field reservation management system with Firebase database.

## 🚀 Features

- **Centralized Database**: All users share the same real-time database
- **Real-time Updates**: Reservations update instantly for all users
- **Secure Authentication**: Login/register system with Firebase Auth
- **Reservation Management**: Create, edit, and cancel reservations
- **Multiple Roles**: Administrator, employee, and client roles
- **Modern Interface**: Responsive design with Tailwind CSS
- **TypeScript**: Type-safe and secure code

## 📋 Requirements

- Node.js 16 or higher
- Firebase account (free)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProyectoElden
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Follow instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Copy `src/services/firebase.example.ts` as `src/services/firebase.ts`
   - Replace configuration with your Firebase credentials

4. **Run the project**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   - Go to `http://localhost:5173`

## 🔥 Firebase Configuration

**IMPORTANT**: For the application to work correctly, you need to configure Firebase. Follow the detailed instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md).

### Quick Summary:
1. Create a project in [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Copy configuration to `src/services/firebase.ts`

## 👥 User Roles

### Client
- Create account and profile
- View available fields
- Make reservations
- View reservation history
- Cancel own reservations

### Employee
- Everything from client role
- Manage other users' reservations
- View basic reports
- Configure field schedules

### Administrator
- Everything from employee role
- Manage users
- Configure fields and sports
- View complete reports
- Full system management


## 🗄️ Database

The application uses Firebase Firestore with the following collections:

- **users**: Registered users
- **reservations**: Made reservations
- **fields**: Available fields
- **sports**: Available sports
- **timeSlots**: Available time slots
- **employees**: Employees
- **positions**: Employee positions
- **documentTypes**: Document types
- **paymentMethods**: Payment methods

## 🔄 Migration from IndexedDB

If you had the previous version with IndexedDB:

1. **Local data will be lost** - Firebase is a cloud database
2. **Configure Firebase** following the instructions
3. **Users will need to register again**
4. **Reservations will start from scratch**

### Migration Benefits:
- ✅ Centralized database
- ✅ Real-time between users
- ✅ Persistent data
- ✅ Scalability
- ✅ Enhanced security

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your repository to Netlify
2. Configure environment variables if needed
3. Deploy automatically

### Vercel
1. Connect your repository to Vercel
2. Configure framework as Vite
3. Deploy

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Sign in: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## 🐛 Troubleshooting

### Firebase Configuration Error
- Verify that `src/services/firebase.ts` has correct configuration
- Ensure Authentication is enabled
- Verify Firestore is created

### Data Not Saving
- Check browser console for errors
- Verify Firestore security rules
- Ensure user is authenticated

### Authentication Issues
- Verify Email/Password is enabled in Firebase
- Check that API key is correct
- Verify project is active

## 📝 Available Scripts

```bash
npm run dev          # Run in development mode
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter
```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have issues:
1. Check browser console
2. Consult [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
3. Review [Firebase documentation](https://firebase.google.com/docs)
4. Open an issue on GitHub

## 🔮 Upcoming Features

- [ ] Push notifications
- [ ] Online payments
- [ ] Mobile app
- [ ] Advanced reports
- [ ] Rating system
- [ ] Real-time chat
