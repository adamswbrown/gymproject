# Average Joe's Gym - Booking System

A full-stack gym booking and management system built with NestJS (backend) and Next.js (frontend). This system provides a complete solution for gym class scheduling, member bookings, instructor management, and administrative functions.

## 🎯 Overview

This application enables gym members to browse class schedules, book sessions, manage their bookings, and access their account information. Instructors can view their assigned sessions and manage rosters, while administrators have full control over class types, sessions, instructors, members, and system configuration.

### Key Features

- **Public Schedule Browsing** - View available classes without authentication
- **Member Booking System** - Book and cancel classes with business rule enforcement
- **Role-Based Access Control** - Separate interfaces for Members, Instructors, and Admins
- **Class Management** - Create and manage class types, sessions, and instructors
- **Member Management** - Profile management, family accounts, and membership tracking
- **Payment Processing** - Stripe integration for membership and product purchases
- **Document Management** - Upload and manage member documents and waivers
- **Store Integration** - Product catalog and order management
- **Responsive Design** - Mobile-friendly interface with consistent design system

## 🏗️ Architecture

### Tech Stack

**Backend:**
- **NestJS** - Progressive Node.js framework
- **Prisma** - Next-generation ORM
- **MySQL** - Database (MAMP default: port 8889)
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **Stripe** - Payment processing
- **Multer** - File upload handling

**Frontend:**
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hooks** - State management
- **Heroicons** - Icon library

### Project Structure

```
gym-booking/
├── api/                    # NestJS backend
│   ├── src/
│   │   ├── auth/          # Authentication & authorization
│   │   ├── bookings/      # Booking management
│   │   ├── classes/       # Class type & session management
│   │   ├── instructors/   # Instructor management
│   │   ├── members/       # Member management
│   │   ├── memberships/    # Membership management
│   │   ├── payments/      # Payment processing
│   │   ├── store/         # Product & order management
│   │   ├── documents/     # Document management
│   │   ├── admin/         # Admin endpoints
│   │   ├── public/        # Public endpoints
│   │   └── prisma/        # Prisma service
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── migrations/    # Database migrations
│   └── scripts/           # Data ingestion scripts
│
├── ui/                     # Next.js frontend
│   ├── app/
│   │   ├── (auth)/        # Authentication routes
│   │   ├── (public)/      # Public marketing pages
│   │   ├── dashboard/     # Protected dashboard routes
│   │   ├── schedule/      # Public schedule view
│   │   └── store/         # Store pages
│   ├── components/
│   │   ├── layout/        # Layout components
│   │   ├── ui/            # Reusable UI components
│   │   └── payments/      # Payment components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities & API client
│
└── scripts/               # Utility scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **MySQL** (MAMP or standalone)
- **npm** or **yarn**
- **Git**

### Installation

1. **Clone the repository:**
```bash
git clone <repository-url>
cd gym-booking
```

2. **Install backend dependencies:**
```bash
cd api
npm install
```

3. **Install frontend dependencies:**
```bash
cd ../ui
npm install
```

### Configuration

#### Backend Configuration

1. **Create environment file:**
```bash
cd api
cp .env.example .env
```

2. **Edit `.env` with your database credentials:**
```env
DATABASE_URL="mysql://root:root@localhost:8889/sports_club_db"
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. **Generate Prisma client:**
```bash
npm run prisma:generate
```

4. **Run database migrations:**
```bash
npm run prisma:migrate
```

5. **Seed the database (optional):**
```bash
npm run prisma:seed
```

#### Frontend Configuration

1. **Create environment file:**
```bash
cd ui
cp .env.local.example .env.local
```

2. **Edit `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Running the Application

#### Development Mode

**Backend:**
```bash
cd api
npm run start:dev
```
Backend runs on `http://localhost:3001`

**Frontend:**
```bash
cd ui
npm run dev
```
Frontend runs on `http://localhost:3000`

#### Production Mode

**Backend:**
```bash
cd api
npm run build
npm run start:prod
```

**Frontend:**
```bash
cd ui
npm run build
npm start
```

## 📚 Documentation

### API Documentation

The backend API provides comprehensive endpoints for all system functionality. See [api/README.md](./api/README.md) for detailed API documentation including:

- Authentication endpoints
- Booking management
- Class and session management
- Member management
- Payment processing
- Admin functions

### Frontend Documentation

The frontend uses a consistent design system and component architecture. See [ui/README.md](./ui/README.md) for:

- Design system guidelines
- Component structure
- Routing and navigation
- State management

## 👥 User Roles

### Member
- Browse public class schedule
- Book and cancel classes
- View personal bookings
- Manage profile and family accounts
- Purchase memberships and products
- Upload documents and waivers

### Instructor
- View assigned sessions
- View session rosters
- Manage session details

### Admin
- Full system access
- Manage class types and sessions
- Manage instructors and members
- Configure system settings
- View reports and analytics

## 🔐 Authentication

### Registration
All users register via `/auth/register` and are automatically assigned the `MEMBER` role. Admin and Instructor roles must be assigned manually via database or admin interface.

### Login
JWT tokens are issued upon successful authentication and stored in `localStorage` on the frontend. Tokens are included in the `Authorization: Bearer <token>` header for protected endpoints.

### Test Accounts

**Member Account:**
- Email: `member@example.com`
- Password: `password123`
- Role: MEMBER

## 🎨 Design System

The frontend follows a consistent, minimal design aesthetic:

### Typography
- **Headings**: Oswald (uppercase, bold)
  - H1: `text-4xl sm:text-5xl`
  - H2: `text-2xl sm:text-3xl`
- **Body**: Inter (`text-base leading-7`)

### Colors
- Background Primary: `#F5F5F0`
- Background Secondary: `#FFFFFF`
- Background Dark: `#2C2C2C`
- Text Primary: `#333333`
- Text Dark: `#1A1A1A`
- Accent Primary: `#C84A3A`

### Layout
- Container: `max-w-6xl` with responsive padding
- Section spacing: `py-10 sm:py-14`
- Grid gaps: `gap-6`

### Buttons
- Square corners (no rounded corners)
- Uppercase text
- Consistent padding: `px-4 py-2`

## 📱 Pages & Routes

### Public Pages
- `/` - Home page with hero and features
- `/why-join-us` - Why train here
- `/what-we-offer` - What we have
- `/reviews` - Member testimonials
- `/coaches` - Coach profiles
- `/who-you-are` - Target audience
- `/blog` - Blog (coming soon)
- `/contact-us` - Contact information
- `/schedule` - Public class schedule (requires auth to book)

### Authentication
- `/login` - User login
- `/register` - User registration

### Member Dashboard
- `/dashboard/member/bookings` - View bookings
- `/dashboard/member/upcoming` - Upcoming sessions
- `/dashboard/member/registrations` - Course registrations
- `/dashboard/member/memberships` - Membership management
- `/dashboard/member/payments` - Payment history
- `/dashboard/member/documents` - Document management
- `/dashboard/member/family` - Family account management
- `/dashboard/member/profile` - Profile settings
- `/dashboard/member/contact` - Contact support
- `/dashboard/member/notifications` - Notifications

### Instructor Dashboard
- `/dashboard/instructor/sessions` - Assigned sessions
- `/dashboard/instructor/sessions/[id]/roster` - Session roster

### Admin Dashboard
- `/dashboard/admin/class-types` - Manage class types
- `/dashboard/admin/sessions` - Manage sessions
- `/dashboard/admin/instructors` - Manage instructors
- `/dashboard/admin/users` - Manage users
- `/dashboard/admin/products` - Manage products

### Store
- `/store` - Product catalog
- `/store/[id]` - Product details
- `/store/orders` - Order history

## 🔧 Development

### Database Management

**Prisma Studio (Visual Database Browser):**
```bash
cd api
npm run prisma:studio
```

**Create Migration:**
```bash
cd api
npm run prisma:migrate dev --name migration_name
```

**Reset Database:**
```bash
cd api
npm run prisma:migrate reset
```

### Data Ingestion

The system includes scripts to import data from TeamUp:

```bash
cd api
npm run script:fetch-teamup-data
npm run script:ingest-teamup-data
```

### Testing

**Backend Tests:**
```bash
cd api
npm test              # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

## 🛠️ Key Features

### Booking System
- Real-time capacity tracking
- Registration window enforcement
- Cancellation cutoff enforcement
- Duplicate booking prevention
- Atomic transaction safety

### Payment Processing
- Stripe integration for secure payments
- Membership subscriptions
- Product purchases
- Payment history tracking

### Document Management
- Secure file uploads
- Document categorization
- Member document access
- Waiver management

### Family Accounts
- Link family members
- Shared booking management
- Family membership options

## 📦 Environment Variables

### Backend (`api/.env`)
| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | MySQL connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `JWT_EXPIRES_IN` | Token expiration | No (default: 7d) |
| `PORT` | Server port | No (default: 3000) |
| `NODE_ENV` | Environment | No |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes (for payments) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes (for payments) |

### Frontend (`ui/.env.local`)
| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes (for payments) |

## 🐛 Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check `DATABASE_URL` in `.env`
- Ensure database exists
- Run migrations: `npm run prisma:migrate`

### Port Conflicts
- Backend default: `3001`
- Frontend default: `3000`
- Update ports in `.env` files if needed

### Authentication Issues
- Clear `localStorage` in browser
- Verify `JWT_SECRET` is set
- Check token expiration settings

## 📄 License

ISC

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Write/update tests
4. Submit a pull request

## 📞 Support

For issues and questions:
- Open an issue in the repository
- Check existing documentation in `api/README.md` and `ui/README.md`

## 🔄 Recent Updates

- ✅ Standardized public page layouts and typography
- ✅ Removed YouTube embeds from marketing pages
- ✅ Implemented consistent design system
- ✅ Added public layout wrapper for shared components
- ✅ Improved responsive design across all pages

---

**Built with ❤️ for Average Joe's Gym**
