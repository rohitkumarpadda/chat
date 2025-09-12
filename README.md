# CipherChat 🔐

A secure, end-to-end encrypted chat application built with modern web technologies. CipherChat provides privacy-focused messaging with military-grade encryption, ensuring your conversations remain completely private.

## 🌟 Features

### 🔒 Security & Privacy
- **End-to-End Encryption**: Messages are encrypted using PGP (Pretty Good Privacy) encryption
- **RSA Key Generation**: RSA 2048-bit keys for secure communication
- **Digital Signatures**: Message authenticity verification using cryptographic signatures
- **Session Keys**: Dynamic session key generation for enhanced security
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing

### 💬 Chat Features
- **Real-time Messaging**: Instant messaging powered by Socket.IO
- **Message Management**: Edit and delete messages with full encryption
- **User Management**: User registration, login, and profile management
- **Conversation History**: Encrypted conversation persistence
- **Message Status**: Read receipts and delivery confirmations

### 🛠 Technical Features
- **Monorepo Architecture**: Clean separation between API and Web applications
- **TypeScript**: Full type safety across the entire application
- **Modern UI**: Beautiful interface built with Mantine UI components
- **Docker Support**: Containerized deployment with Docker Compose
- **MongoDB Integration**: Reliable data persistence
- **Hot Reload**: Development-friendly with automatic reloading

## 🏗 Architecture

### Backend (API)
- **Express.js**: RESTful API server
- **Socket.IO**: Real-time WebSocket communication
- **Passport.js**: Authentication middleware
- **Mongoose**: MongoDB object modeling
- **JWT**: Secure token-based authentication

### Frontend (Web)
- **Next.js**: React-based web application
- **Mantine**: Modern React components library
- **OpenPGP.js**: Client-side encryption implementation
- **Axios**: HTTP client for API communication
- **SWR**: Data fetching and caching

### Database & Infrastructure
- **MongoDB**: Document-based database
- **Docker**: Containerization platform
- **Turbo**: Monorepo build system

## 📋 Prerequisites

Before running CipherChat, ensure you have the following installed:

- **Node.js** (v14.0.0 or higher)
- **Yarn** package manager
- **Docker** and Docker Compose
- **OpenSSL** (for RSA key generation)

## 🚀 Quick Start

Follow these steps to get CipherChat running on your local machine:

### 1. Install Dependencies
```bash
yarn
```

### 2. Start Infrastructure Services
Start the MongoDB database using Docker Compose:
```bash
docker-compose up -d
```
This command will:
- Pull the MongoDB Docker image
- Start MongoDB on port 27017
- Create persistent data storage in `./.docker/data/mongo`
- Set up database with root credentials

### 3. Generate RSA Encryption Keys
Navigate to the API directory and generate the required RSA key pair:
```bash
cd apps/api
openssl genrsa -out private.pem 2048
openssl rsa -in private.pem -pubout -out public.pem
```
These commands will:
- Generate a 2048-bit RSA private key (`private.pem`)
- Extract the corresponding public key (`public.pem`)
- Keys are used for server-side encryption operations

### 4. Navigate Back to Project Root
```bash
cd ..
cd..
```

### 5. Start Development Servers
Launch both the API and Web applications:
```bash
yarn dev
```
This will start:
- **API Server**: http://localhost:3001 (Express.js backend)
- **Web Application**: http://localhost:3000 (Next.js frontend)

## 🔧 Configuration

### Environment Variables

Create environment files for both applications:

#### API Configuration (`apps/api/.env`)
```env
NODE_ENV=development
PORT=3001
DB_URI=mongodb://root:root@localhost:27017/cipherchat?authSource=admin
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

#### Web Configuration (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## 📁 Project Structure

```
CipherChat/
├── apps/
│   ├── api/                    # Express.js Backend
│   │   ├── src/
│   │   │   ├── api/           # API route handlers
│   │   │   │   ├── auth/      # Authentication endpoints
│   │   │   │   ├── chat/      # Chat message handling
│   │   │   │   ├── key/       # Public key management
│   │   │   │   └── user/      # User management
│   │   │   ├── config/        # Configuration files
│   │   │   ├── middleware/    # Express middlewares
│   │   │   ├── socket/        # Socket.IO event handlers
│   │   │   └── utils/         # Utility functions
│   │   ├── private.pem        # RSA private key (generated)
│   │   └── public.pem         # RSA public key (generated)
│   └── web/                   # Next.js Frontend
│       ├── src/
│       │   ├── features/      # Feature-based modules
│       │   │   ├── auth/      # Authentication UI
│       │   │   ├── chat/      # Chat interface
│       │   │   └── key/       # Key management UI
│       │   ├── pages/         # Next.js pages
│       │   └── utils/         # Client-side utilities
│       └── public/            # Static assets
├── packages/
│   ├── interfaces/            # Shared TypeScript interfaces
│   ├── ui/                    # Shared UI components
│   └── tsconfig/             # Shared TypeScript configurations
├── docker-compose.yml         # Docker services configuration
└── package.json              # Root package configuration
```

## 🔐 Security Implementation

### Message Encryption Flow
1. **Key Generation**: Each user generates a PGP key pair (public/private)
2. **Message Encryption**: Messages are encrypted using recipient's public key
3. **Digital Signing**: Messages are signed with sender's private key
4. **Transmission**: Encrypted and signed messages are sent via WebSocket
5. **Decryption**: Recipients decrypt using their private key
6. **Verification**: Message authenticity is verified using sender's public key

### Authentication Flow
1. **Registration**: Password is hashed using bcrypt
2. **Login**: Credentials are verified against database
3. **Token Generation**: JWT token is issued for authenticated sessions
4. **API Protection**: All API endpoints are protected with JWT middleware

## 🐳 Docker Services

The `docker-compose.yml` includes:

### MongoDB Service
- **Image**: `mongo:latest`
- **Port**: `27017`
- **Credentials**: `root:root`
- **Data Persistence**: `./.docker/data/mongo`

## 🛠 Available Scripts

### Root Level
- `yarn dev` - Start all development servers
- `yarn build` - Build all applications
- `yarn lint` - Run linting across all packages

### API Specific
- `yarn api dev` - Start API development server
- `yarn api build` - Build API for production
- `yarn api start` - Start production API server

### Web Specific
- `yarn web dev` - Start Web development server
- `yarn web build` - Build Web application
- `yarn web start` - Start production Web server

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Chat
- `GET /api/chat/conversations` - Get user conversations
- `GET /api/chat/messages/:conversationId` - Get conversation messages
- `POST /api/chat/send` - Send encrypted message
- `PUT /api/chat/edit/:messageId` - Edit message
- `DELETE /api/chat/delete/:messageId` - Delete message

### Key Management
- `GET /api/key/:userId` - Get user's public key
- `POST /api/key/upload` - Upload public key

## 🔌 WebSocket Events

### Client to Server
- `sendMessage` - Send new message
- `editMessage` - Edit existing message
- `deleteMessage` - Delete message
- `joinConversation` - Join conversation room

### Server to Client
- `newMessage` - Receive new message
- `messageEdited` - Message was edited
- `messageDeleted` - Message was deleted
- `userOnline` - User came online
- `userOffline` - User went offline

## 🚧 Development

### Adding New Features
1. **API**: Add routes in `apps/api/src/api/`
2. **Frontend**: Add components in `apps/web/src/features/`
3. **Shared Types**: Update interfaces in `packages/interfaces/`

### Code Style
- **ESLint**: Configured for TypeScript
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks (optional)

## 🚀 Production Deployment

### Environment Setup
1. Set production environment variables
2. Generate production RSA keys
3. Configure production MongoDB instance
4. Set up reverse proxy (Nginx recommended)

### Build Commands
```bash
yarn build
yarn start
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 Troubleshooting

### Common Issues

#### MongoDB Connection Error
- Ensure Docker is running
- Check if port 27017 is available
- Verify MongoDB container is started: `docker ps`

#### RSA Key Generation Error
- Ensure OpenSSL is installed
- Check file permissions in `apps/api/` directory
- Verify keys are generated: `ls apps/api/*.pem`

#### Development Server Issues
- Clear node_modules: `rm -rf node_modules && yarn`
- Check port availability (3000, 3001)
- Verify environment variables are set

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**CipherChat** - Secure messaging for the privacy-conscious. 🔐✨