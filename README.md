# Product Categories Microservices

A microservices architecture with microfrontends for product filtering by categories.


- **Frontend**: Next.js microfrontend with Tailwind CSS
- **Middleware**: Express.js REST API server that communicates with backend via gRPC
- **Backend**: Node.js gRPC service for product and category management

## Quick Start

### Option 1: Docker (Recommended)

```bash
# Start all services with Docker
./scripts/docker-dev.sh

# Stop all services
./scripts/docker-stop.sh

# Stop and clean up everything
./scripts/docker-stop.sh --clean
```

### Option 2: Development Mode (Local)

```bash
./scripts/dev.sh
```

### Option 3: Manual Setup

1. **Backend Service:**
   ```bash
   cd app/backend
   npm install
   npm start
   ```

2. **Middleware Service:**
   ```bash
   cd app/middleware
   npm install
   npm start
   ```

3. **Frontend Service:**
   ```bash
   cd app/frontend
   npm install
   npm run dev
   ```

## Access Points

- **Frontend**: http://localhost:3000
- **Middleware API**: http://localhost:4000
- **Backend gRPC**: localhost:5000

## API Endpoints

### Middleware REST API

- `GET /api/products` - Get all products with pagination
- `GET /api/products/category/:categoryId` - Get products by category
- `GET /api/categories` - Get all categories
- `GET /health` - Health check

### Backend gRPC API

- `GetProducts` - Get all products with pagination
- `GetProductsByCategory` - Get products filtered by category
- `GetCategories` - Get all categories
