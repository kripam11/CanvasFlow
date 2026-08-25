# Canvas Flow

A real-time collaborative drawing application inspired by Excalidraw.

Canvas Flow allows multiple users to join shared rooms and draw collaboratively in real time. The application uses WebSockets for live communication, HTML Canvas for rendering shapes, PostgreSQL for data persistence, and a scalable monorepo architecture powered by Turborepo.

The frontend follows a component-based architecture with reusable and generic UI components, styled using Tailwind CSS.

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
- Tailwind CSS for styling
- Reusable and generic UI components
- Component-based frontend architecture
- Shared packages, types, and utilities

## Tech Stack

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
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
│   │   │
│   │   ├── app/             # Application routes and pages
│   │   ├── components/      # Reusable and generic UI components
│   │   ├── hooks/           # Custom React hooks
│   │   └── draw.ts          # Canvas drawing logic
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
```

## Component-Based Architecture

The frontend is structured using reusable and generic components to improve code organization, maintainability, and reusability.

Instead of keeping all UI and logic inside a single component, different responsibilities are separated into independent components.

```text
Page
 │
 ├── Navbar
 │
 ├── Toolbar
 │
 ├── Canvas
 │
 ├── Room Components
 │
 └── Reusable UI Components
```

Generic components can be reused across different parts of the application, reducing duplicated code and making the UI easier to maintain.

## Styling

The frontend uses Tailwind CSS for styling.

Tailwind is used to create responsive and reusable user interfaces while keeping styling close to the components.

This allows:

- Faster UI development
- Consistent styling
- Responsive layouts
- Reusable design patterns
- Better component maintainability

## How It Works

### Authentication Flow

Users can sign up and sign in through the HTTP server.

```text
User
  ↓
Signup / Signin Request
  ↓
Zod Validation
  ↓
HTTP Server
  ↓
bcrypt Password Hashing / Verification
  ↓
Prisma ORM
  ↓
PostgreSQL Database
  ↓
JWT Generated
  ↓
Authenticated User
```

## Real-Time Collaboration

Canvas Flow uses a dedicated WebSocket server to synchronize events between users in the same room.

```text
User A
  │
  │ Draws a shape
  ↓
WebSocket Server
  ↓
Broadcast Event
  ↓
User B
User C
```

Users connected to the same room can receive updates in real time.

## Room Flow

```text
User
  ↓
Enter Room ID
  ↓
Navigate to Canvas
  ↓
Establish WebSocket Connection
  ↓
Join Room
  ↓
Draw Shapes
  ↓
Send Drawing Events
  ↓
WebSocket Server
  ↓
Broadcast Updates to Other Users
```

## Drawing Flow

The application uses the HTML Canvas API to render shapes.

```text
Mouse Down
    ↓
Store Starting Coordinates
    ↓
Mouse Move
    ↓
Calculate Shape Dimensions
    ↓
Render Shape
    ↓
Mouse Up
    ↓
Finalize Drawing
    ↓
Send Drawing Event via WebSocket
    ↓
Broadcast to Other Users
```

## Database

Canvas Flow uses PostgreSQL as its database and Prisma as the ORM.

Prisma provides type-safe communication between the backend services and PostgreSQL.

The database manages application data such as:

- Users
- Authentication data
- Drawing rooms
- Chat messages
- Canvas data
- Shape data
- Persistent room information

```text
Backend Server
      ↓
 Prisma Client
      ↓
 PostgreSQL Database
```

## Validation

Zod is used for runtime validation across the application.

It helps validate:

- Signup requests
- Signin requests
- User input
- API requests
- Room data
- Shared application data
- WebSocket messages

## Monorepo Architecture

Canvas Flow uses Turborepo to manage multiple applications and shared packages.

This architecture allows:

- Shared database configuration
- Shared Prisma client
- Shared Zod schemas
- Shared TypeScript types
- Shared utilities
- Better code organization
- Independent frontend and backend applications
- Improved scalability and maintainability

## Installation

Clone the repository:

```bash
git clone <your-repository-url>
```

Navigate to the project:

```bash
cd CanvasFlow
```

Install dependencies:

```bash
pnpm install
```

## Environment Variables

Create the required `.env` files for the applications.

Example:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/canvasflow"

JWT_SECRET="your_secret_key"
```

Make sure PostgreSQL is running before starting the application.

Do not commit `.env` files to GitHub.

## Prisma Setup

Generate the Prisma client:

```bash
pnpm prisma generate
```

Run database migrations:

```bash
pnpm prisma migrate dev
```

## Running the Project

Run the complete monorepo:

```bash
pnpm dev
```

Or run the applications individually.

### Frontend

```bash
cd apps/excalidraw-fe
pnpm dev
```

### HTTP Server

```bash
cd apps/http-server
pnpm dev
```

### WebSocket Server

```bash
cd apps/ws-server
pnpm dev
```

## Key Concepts Used

- Real-time communication with WebSockets
- Room-based collaboration
- HTML Canvas API
- Component-based architecture
- Reusable and generic React components
- Tailwind CSS
- Next.js and React
- TypeScript
- Custom React hooks
- Monorepo architecture
- Turborepo
- PostgreSQL
- Prisma ORM
- JWT authentication
- Password hashing with bcrypt
- Runtime validation with Zod
- Shared packages and TypeScript types

## Future Improvements

- Rectangle, circle, line, and arrow tools
- Freehand drawing
- Text elements
- Shape selection and deletion
- Undo and redo functionality
- Persistent canvas state
- Saving and loading drawings
- Multiple cursors
- User presence indicators
- Shape editing and resizing
- Improved toolbar and UI
- Better room permissions and access control

## Author

Built by **Kripa**

---

Canvas Flow is a full-stack real-time collaborative drawing application built to explore WebSockets, HTML Canvas, reusable component architecture, Tailwind CSS, authentication, PostgreSQL, Prisma, and scalable monorepo development.
