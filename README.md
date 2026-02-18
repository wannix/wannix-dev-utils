# DevUtils - Developer Utilities Hub

A collection of essential developer tools built with React, TypeScript, and Tailwind CSS.

## Features

- **Base64 Encoder/Decoder** - Encode and decode Base64 strings
- **JWT Decoder** - Decode and inspect JWT tokens
- **UUID Generator** - Generate UUIDs, ULIDs, and KSUIDs
- **Spring ↔ YAML Converter** - Convert between application.properties and YAML
- **JSON ↔ YAML Converter** - Convert between JSON and YAML formats
- **Certificate Decoder** - Decode X.509 PEM certificates and CSRs
- **Unix Timestamp Converter** - Convert between timestamps and dates
- **ID Generator Suite** - Generate various ID formats
- **Hash Generator** - Generate MD5, SHA-256, SHA-512 hashes and HMAC
- **Curl Builder** - Build curl commands with a visual interface
- **Diff Checker** - Compare two texts and highlight differences
- **Cron Tester** - Validate cron expressions and preview runs
- **SVG Optimizer** - Optimize SVG files
- **Regex Tester** - Test regular expressions with real-time matching
- **Keycode Info** - Get JavaScript keycode event properties

## Prerequisites

Before running this project locally, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/) or [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- **npm** (v9.0.0 or higher) - Comes bundled with Node.js
- **Git** - [Download](https://git-scm.com/downloads)

### Verify Installation

```sh
node --version  # Should output v18.x.x or higher
npm --version   # Should output 9.x.x or higher
git --version   # Should output git version 2.x.x
```

## Local Development Setup

### 1. Clone the Repository

```sh
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Start Development Server

```sh
npm run dev
```

The app will be available at `http://localhost:8080`

### 4. Build for Production

```sh
npm run build
```

### 5. Preview Production Build

```sh
npm run preview
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |
| `npm run test` | Run tests with Vitest |

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **React Router** - Client-side routing
- **Vitest** - Unit testing framework

## Project Structure

```
src/
├── components/
│   ├── common/         # Shared components (CopyButton, ToolCard, etc.)
│   ├── layout/         # Layout components (Sidebar, Layout)
│   ├── ui/             # shadcn/ui components
│   └── utilities/      # Tool-specific components
├── hooks/              # Custom React hooks
├── lib/
│   ├── converters/     # Utility conversion functions
│   └── validators/     # Validation schemas
├── pages/              # Route page components
└── test/               # Test setup and utilities
```


## Docker & Deployment

This project includes a production-ready `Dockerfile` optimized for performance and security using a multi-stage build process (Node.js builder → Node.js runner). It uses a custom Express server (`server.js`) to serve static assets with gzip compression, security headers, and SPA routing support.

### Build Docker Image

```sh
docker build -t devutils-hub .
```

### Run Docker Container

```sh
docker run -p 8080:80 devutils-hub
```

The app will be available at `http://localhost:8080`.

### Kubernetes Deployment

The application serves the app via a Node.js server on port 80 and includes a health check endpoint at `/health`.

A basic Kubernetes deployment configuration:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: devutils-hub
spec:
  replicas: 2
  selector:
    matchLabels:
      app: devutils-hub
  template:
    metadata:
      labels:
        app: devutils-hub
    spec:
      containers:
        - name: devutils-hub
          image: devutils-hub:latest
          ports:
            - containerPort: 80
          livenessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 30
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /health
              port: 80
---
apiVersion: v1
kind: Service
metadata:
  name: devutils-hub
spec:
  selector:
    app: devutils-hub
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

## License

MIT
