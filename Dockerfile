# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Fix for private registry in lockfile: replace private Nexus URL with public npm registry
# This avoids E401 errors when building outside the corporate network
RUN sed -i 's|https://nexus.services.fsniwaikato.kiwi/repository/npm-group/|https://registry.npmjs.org/|g' package-lock.json

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
