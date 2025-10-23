const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:80'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Load the protobuf definition
// Check if running in Docker (proto at ./proto) or locally (proto at ../proto)
let PROTO_PATH = path.join(__dirname, 'proto/product.proto');
if (!fs.existsSync(PROTO_PATH)) {
    PROTO_PATH = path.join(__dirname, '../proto/product.proto');
}
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const productProto = grpc.loadPackageDefinition(packageDefinition).product;

// Create gRPC client
const GRPC_HOST = process.env.GRPC_HOST || 'localhost:5000';
const client = new productProto.ProductService(
    GRPC_HOST,
    grpc.credentials.createInsecure()
);

// Helper function to handle gRPC calls
const callGrpc = (method, request) => {
    return new Promise((resolve, reject) => {
        client[method](request, (error, response) => {
            if (error) {
                reject(error);
            } else {
                resolve(response);
            }
        });
    });
};

// REST API Routes

// Get all products
app.get('/api/products', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;

        const request = {
            page: parseInt(page),
            limit: parseInt(limit),
            search: search
        };

        const response = await callGrpc('GetProducts', request);
        res.json(response);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// Get products by category
app.get('/api/products/category/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const { page = 1, limit = 10, search = '' } = req.query;

        const request = {
            category_id: categoryId,
            page: parseInt(page),
            limit: parseInt(limit),
            search: search
        };

        const response = await callGrpc('GetProductsByCategory', request);
        res.json(response);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        res.status(500).json({ error: 'Failed to fetch products by category' });
    }
});

// Get all categories
app.get('/api/categories', async (req, res) => {
    try {
        const { parentId = '' } = req.query;

        const request = {
            parent_id: parentId
        };

        const response = await callGrpc('GetCategories', request);
        res.json(response);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'product-middleware' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`Middleware service running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API endpoints:`);
    console.log(`  GET /api/products`);
    console.log(`  GET /api/products/category/:categoryId`);
    console.log(`  GET /api/categories`);
});