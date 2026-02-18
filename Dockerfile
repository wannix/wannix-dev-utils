# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the application for production
RUN npm run build

# Stage 2: Serve the application with Node.js
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy package files to install only production dependencies
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built assets from builder stage
COPY --from=builder /app/dist ./dist

# Copy the production server script
COPY server.js .

# Add a non-root user for security
# Alpine comes with a 'node' user in base image
USER node

# Expose port 80
EXPOSE 80

# Start the server
CMD ["node", "server.js"]
