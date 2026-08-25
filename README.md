# Canvas Flow

A real-time collaborative drawing application inspired by Excalidraw.

Canvas Flow allows multiple users to join shared rooms and draw collaboratively in real time. The application uses WebSockets for live communication, HTML Canvas for rendering shapes, and a scalable monorepo architecture powered by Turborepo.

## Features

- Real-time collaborative drawing
- Create and join drawing rooms
- Live synchronization using WebSockets
- Draw shapes using the HTML Canvas API
- Room-based communication
- User authentication using JWT
- Secure password hashing using bcrypt
- Runtime validation using Zod
- PostgreSQL database integration
- Prisma ORM for database management
- Monorepo architecture using Turborepo
- Shared packages, types, and utilities

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- HTML Canvas API

### Backend

- Node.js
- HTTP Server
- WebSocket Server
- WebSockets
- JWT Authentication
- bcrypt

### Database

- PostgreSQL
- Prisma ORM

### Validation & Tooling

- Zod
- Turborepo
- pnpm Workspaces
- TypeScript

## Project Architecture

Canvas Flow follows a monorepo architecture powered by Turborepo.

```text
CanvasFlow/
│
├── apps/
│   │
│   ├── excalidraw-fe/       # Next.js frontend
│   │
│   ├── http-server/         # Authentication and HTTP APIs
│   │
│   └── ws-server/           # WebSocket server for real-time communication
│
├── packages/
│   │
│   ├── db/                  # Prisma client and database configuration
│   │
│   └── common/              # Shared Zod schemas, types, and utilities
│
├── package.json
├── turbo.json
└── README.md
