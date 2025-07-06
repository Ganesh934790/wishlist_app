# Collaborative Product Wishlist App

A beautiful, real-time collaborative wishlist application built with React, Node.js, and WebSockets. Users can create shared wishlists, add products, invite collaborators, and interact with items through reactions and comments.

## Features

### Core Features
- **User Authentication**: Secure signup/login with email and password
- **Create & Manage Wishlists**: Create multiple wishlists with names and descriptions
- **Product Management**: Add, edit, and delete products with images, prices, and descriptions
- **Collaboration**: Invite users to collaborate on wishlists
- **Real-time Updates**: Live synchronization using WebSockets
- **Reactions & Comments**: Express opinions with emoji reactions
- **Responsive Design**: Mobile-friendly interface

### Design Elements
- **Modern UI**: Glassmorphism effects with gradient backgrounds
- **Interactive Elements**: Smooth animations and hover effects
- **Clean Layout**: Card-based design with intuitive navigation
- **Professional Color Scheme**: Purple/pink gradient theme
- **Responsive Grid**: Optimized for all screen sizes

## Tech Stack

- **Frontend**: React 18 with TypeScript, Tailwind CSS, Lucide React icons
- **Backend**: Node.js with Express.js
- **Database**: JSON file-based storage (can be easily replaced with PostgreSQL/MongoDB)
- **Real-time**: WebSockets for live updates
- **Build Tool**: Vite for fast development and building

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd collaborative-wishlist-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the frontend (port 5173) and backend (port 3001) servers concurrently.

4. **Open the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

### Production Build

```bash
npm run build
npm run preview
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password

### Wishlists
- `GET /api/wishlists` - Get user's wishlists
- `POST /api/wishlists` - Create new wishlist
- `GET /api/wishlists/:id` - Get specific wishlist
- `POST /api/wishlists/:id/invite` - Invite user to wishlist

### Products
- `POST /api/wishlists/:id/products` - Add product to wishlist
- `PUT /api/wishlists/:id/products/:productId` - Update product
- `DELETE /api/wishlists/:id/products/:productId` - Delete product
- `POST /api/wishlists/:id/products/:productId/reactions` - Add reaction

## Real-time Features

The application uses WebSockets for real-time synchronization:
- Live product additions/updates/deletions
- Real-time reactions and comments
- Instant collaboration updates
- Automatic reconnection on connection loss

## Usage

1. **Sign up/Login**: Create an account or log in with existing credentials
2. **Create Wishlist**: Click "Create Wishlist" to start a new shared list
3. **Add Products**: Click "Add Product" to include items with images, prices, and descriptions
4. **Invite Collaborators**: Use the "Invite" button to add others via email
5. **Interact**: React to products with emojis and edit/delete your own items
6. **Real-time Collaboration**: See updates from other users instantly

## Assumptions & Limitations

### Assumptions
- Simple authentication without password hashing (for demo purposes)
- Email-based user identification for invitations
- File-based JSON storage for simplicity
- Mock user data for collaborators

### Limitations
- No persistent user sessions (uses localStorage)
- No email verification for invitations
- Limited to JSON file storage (not production-ready)
- No image upload functionality (URLs only)
- No push notifications

## Scaling & Improvements

### Database Migration
- Replace JSON files with PostgreSQL/MongoDB
- Implement proper database schema and relationships
- Add indexes for better query performance

### Authentication & Security
- Implement proper password hashing (bcrypt)
- Add JWT tokens for session management
- Implement refresh tokens
- Add rate limiting and input validation

### Real-time Enhancements
- Use Redis for WebSocket session management
- Implement room-based WebSocket connections
- Add typing indicators and presence status
- Implement push notifications

### Feature Enhancements
- Image upload with cloud storage (AWS S3, Cloudinary)
- Advanced search and filtering
- Product categories and tags
- Price tracking and alerts
- Export/import functionality
- Mobile app (React Native)

### Performance Optimizations
- Implement caching layers (Redis)
- Add CDN for static assets
- Optimize database queries
- Implement lazy loading for large lists

### DevOps & Monitoring
- Add Docker containerization
- Implement CI/CD pipelines
- Add monitoring and logging (Sentry, LogRocket)
- Set up automated testing
- Add performance monitoring

## Architecture

```
├── src/
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── pages/            # Page components
│   ├── services/         # API and WebSocket services
│   ├── types.ts          # TypeScript interfaces
│   └── App.tsx           # Main app component
├── server/
│   ├── index.js          # Express server with WebSocket
│   └── data/             # JSON file storage
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.