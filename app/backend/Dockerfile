FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY backend/server.js ./

# Copy proto files
COPY proto ./proto

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
