# BlogIt - A Modern Blogging Platform

## 📝 Project Overview

BlogIt is a full-stack blogging platform that allows users to create, read, update, and delete blog posts. The application features a modern, responsive UI with user authentication, image uploads, and a beautiful nature-themed design.

## 🚀 Features Implemented

### 🔐 Authentication & User Management
- **User Registration**: Secure user registration with validation
- **User Login**: Login with email/username and password
- **JWT Authentication**: Secure token-based authentication
- **Password Management**: Change password functionality with current password verification
- **User Profile**: User information management with ability to update firstName, lastName, emailAddress, and username

### 📝 Blog Management
- **Create Blogs**: Rich blog creation with title, content, synopsis, and image uploads
- **View Blogs**: Display all blogs with beautiful card layouts
- **Blog Details**: Detailed view of individual blog posts
- **Edit Blogs**: Update existing blog posts with image upload functionality
- **Delete Blogs**: Remove blog posts with confirmation
- **Blog Ownership**: Users can only edit/delete their own blogs
- **Image Management**: Upload new images or use external URLs when editing blogs

### 🎨 User Interface
- **Responsive Design**: Mobile-friendly responsive layout
- **Modern UI**: Material-UI components with custom styling
- **Nature Theme**: Beautiful nature background and design elements
- **Animations**: Smooth animations and transitions
- **Loading States**: Proper loading indicators and error handling

## 🛠️ Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | Frontend framework for building user interfaces |
| **TypeScript** | 5.8.3 | Type-safe JavaScript development |
| **Material-UI (MUI)** | 7.2.0 | React component library for UI design |
| **React Router DOM** | 7.6.3 | Client-side routing and navigation |
| **Axios** | 1.10.0 | HTTP client for API communication |
| **JWT Decode** | 4.0.0 | JWT token decoding for authentication |
| **Vite** | 6.3.5 | Fast build tool and development server |
| **ESLint** | 9.25.0 | Code linting and quality assurance |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | - | JavaScript runtime environment |
| **Express.js** | 5.1.0 | Web application framework |
| **TypeScript** | 5.8.3 | Type-safe JavaScript development |
| **Prisma** | 6.11.1 | Database ORM and migration tool |
| **PostgreSQL** | - | Primary database |
| **JWT** | 9.0.2 | JSON Web Token for authentication |
| **Bcrypt.js** | 3.0.2 | Password hashing and verification |
| **Multer** | 2.0.1 | File upload handling |
| **CORS** | 2.8.5 | Cross-origin resource sharing |
| **Zod** | 3.25.76 | Schema validation |
| **Zxcvbn** | 4.4.2 | Password strength validation |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Nodemon** | Auto-restart server during development |
| **Prettier** | Code formatting |
| **ESLint** | Code linting and quality assurance |

## 🏗️ Architecture

### Frontend Architecture
```
FRONTEND/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── LandingPage.tsx  # Homepage with animations
│   │   ├── LoginForm.tsx    # User login form
│   │   ├── RegistrationForm.tsx # User registration
│   │   ├── CreateBlogForm.tsx   # Blog creation form with image upload
│   │   ├── EditBlogForm.tsx     # Blog editing form with image upload
│   │   ├── EditProfileForm.tsx  # User profile editing form
│   │   ├── ProfileMenu.tsx      # User profile menu
│   │   └── ChangePasswordForm.tsx # Password change form
│   ├── pages/              # Page components
│   │   ├── BlogList.tsx    # Blog listing page
│   │   └── BlogDetail.tsx  # Individual blog view
│   ├── services/           # API services
│   │   └── api.ts         # Axios configuration
│   ├── App.tsx            # Main application component
│   └── main.tsx           # Application entry point
```

### Backend Architecture
```
BACKEND/
├── src/
│   ├── controllers/        # Business logic handlers
│   │   ├── auth.controller.ts    # Authentication logic
│   │   ├── blog.controller.ts    # Blog CRUD operations
│   │   └── checkUserExist.controller.ts # User validation
│   ├── middlewares/        # Express middlewares
│   │   ├── verifyToken.ts  # JWT authentication middleware
│   │   └── validate.ts     # Request validation middleware
│   ├── routes/             # API route definitions
│   │   ├── auth.ts         # Authentication routes
│   │   └── blog.ts         # Blog routes
│   ├── schemas/            # Validation schemas
│   │   ├── registerSchema.ts     # Registration validation
│   │   ├── blog.schema.ts        # Blog validation
│   │   ├── changePassword.schema.ts # Password change validation
│   │   └── updateUser.schema.ts  # User update validation
│   └── index.ts           # Server entry point
├── prisma/
│   └── schema.prisma      # Database schema definition
└── uploads/               # File upload directory
```

## 🗄️ Database Schema

### User Model
```prisma
model User {
  id           String  @id @default(uuid())
  firstName    String
  lastName     String
  emailAddress String  @unique
  password     String
  username     String  @unique
  isDeleted    Boolean @default(false)
  blogs        Blog[]
}
```

### Blog Model
```prisma
model Blog {
  id          String   @id @default(uuid())
  image       String
  title       String
  synopsis    String
  content     String
  dateCreated DateTime
  lastUpdated DateTime
  isDeleted   Boolean  @default(false)
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}
```

## 🔧 API Endpoints

### Authentication Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PATCH /api/auth/update` - Update user profile (firstName, lastName, emailAddress, username)
- `POST /api/auth/change-password` - Change password

### Blog Routes
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:id` - Get specific blog
- `POST /api/blogs/create` - Create new blog (with image upload)
- `PATCH /api/blogs/:id` - Update blog (with image upload)
- `DELETE /api/blogs/:id` - Delete blog

## 🎯 Key Features Implementation

### 1. **Secure Authentication**
- **JWT Tokens**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Password Strength**: Zxcvbn for password strength validation
- **Token Verification**: Middleware for protected routes

### 2. **File Upload System**
- **Multer**: Handles image file uploads for both creation and editing
- **Static File Serving**: Serves uploaded images
- **Image Preview**: Real-time preview of uploaded images
- **Multiple Upload Options**: File upload or external URL input
- **Error Handling**: Graceful handling of upload failures

### 3. **Database Management**
- **Prisma ORM**: Type-safe database operations
- **Migrations**: Database schema versioning
- **Relationships**: Proper user-blog relationships
- **Soft Deletes**: Logical deletion with isDeleted flag

### 4. **Frontend State Management**
- **React Hooks**: useState and useEffect for state management
- **Local Storage**: JWT token persistence
- **Context**: User authentication state

### 5. **UI/UX Features**
- **Responsive Design**: Mobile-first approach
- **Material-UI**: Consistent design system
- **Custom Styling**: Nature-themed backgrounds and animations
- **Loading States**: User feedback during operations
- **Error Handling**: User-friendly error messages
- **Image Preview**: Real-time preview of uploaded images
- **Fixed Header**: Persistent navigation with blog creation and profile access

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Carlpri/Blogging-Fullstack-App.git
   cd blogit
   ```

2. **Backend Setup**
   ```bash
   cd BACKEND
   npm install
   cp .env.example .env  # Create environment file
   # Configure DATABASE_URL and JWT_SECRET in .env
   npx prisma migrate dev
   npm run start:dev
   ```

3. **Frontend Setup**
   ```bash
   cd FRONTEND
   npm install
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5678

## 🔒 Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based sessions
- **Input Validation**: Zod schema validation
- **CORS Protection**: Cross-origin request handling
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: Input sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- Various screen sizes and orientations

## 🎨 Design System

- **Color Palette**: Nature-inspired colors with transparency
- **Typography**: Custom fonts (Fjalla One, Bilbo)
- **Animations**: Smooth transitions and hover effects
- **Layout**: Card-based design with glassmorphism effects
- **Background**: Nature-themed backgrounds with overlay effects
- **Fixed Header**: Persistent navigation bar with glassmorphism effect
- **Image Management**: Intuitive image upload and preview interface

## 🔧 Development Scripts

### Backend
- `npm run start:dev` - Start development server
- `npm run build` - Build for production
- `npm run start:prod` - Start production server
- `npm run format` - Format code with Prettier

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please contact the development team.

---

**© WriteStack 2025. All rights reserved.**
