# Findora E-commerce Platform

A modern, secure e-commerce platform built with Next.js, TypeScript, and PostgreSQL.

## 🚀 Features

- **Secure Authentication**: JWT-based authentication with NextAuth.js
- **Social Login**: Google OAuth integration
- **User Management**: Complete user registration and profile system
- **Progressive Web App**: PWA-ready with offline capabilities
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

### Frontend
- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Radix UI components
- React Hook Form with Zod validation

### Backend
- Next.js API routes
- NextAuth.js for authentication
- Prisma ORM
- PostgreSQL database
- bcrypt for password hashing

### Security
- JWT tokens with refresh mechanism
- Input validation and sanitization
- Rate limiting (planned)
- CSRF protection
- XSS protection

## 📋 Prerequisites

- Node.js 18 or later
- PostgreSQL 12 or later
- npm or yarn

## 🚀 Getting Started

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd findora
npm install
```

### 2. Database Setup

1. Create a PostgreSQL database:
```sql
CREATE DATABASE findora_db;
```

2. Update environment variables in `.env.local`:
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/findora_db"

# NextAuth
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# OAuth Providers
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# JWT
JWT_SECRET="your-jwt-secret-key-here"
```

### 3. Generate Database Schema

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Or run migrations (recommended for production)
npm run db:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/signin` - User sign in
- `GET /api/auth/signout` - User sign out
- NextAuth.js endpoints: `/api/auth/*`

## 🗂️ Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   ├── auth/
│   │   ├── signin/
│   │   └── signup/
│   ├── dashboard/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── providers/
│   └── ui/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   └── utils.ts
├── types/
│   └── next-auth.d.ts
└── middleware.ts
```

## 🔐 Authentication Flow

1. **Registration**: Users can register with email/password or Google OAuth
2. **Sign In**: JWT-based authentication with secure session management
3. **Protected Routes**: Middleware protects authenticated routes
4. **Session Management**: NextAuth.js handles session persistence

## 🛡️ Security Features

- **Password Security**: bcrypt hashing with salt rounds
- **Input Validation**: Zod schema validation on all forms
- **Type Safety**: TypeScript prevents runtime errors
- **Protected Routes**: Middleware guards authenticated pages
- **Environment Variables**: Sensitive data in environment files

## 🚧 Development Roadmap

### Phase 1: Core MVP (Current)
- [x] User authentication system
- [x] Basic UI components
- [x] Database schema
- [x] PWA configuration
- [ ] Testing setup

### Phase 2: Product Management
- [ ] Product catalog
- [ ] Search functionality
- [ ] Categories and filters

### Phase 3: E-commerce Features
- [ ] Shopping cart
- [ ] Checkout process
- [ ] Payment integration (Stripe)
- [ ] Order management

### Phase 4: Advanced Features
- [ ] User reviews and ratings
- [ ] Seller dashboard
- [ ] Analytics and reporting
- [ ] Email notifications

## 🧪 Testing

Testing framework setup is planned for the next phase.

## 📱 PWA Features

The application includes:
- Web App Manifest
- Responsive design
- Offline-ready architecture (planned)
- Install prompts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests (when available)
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the repository.
