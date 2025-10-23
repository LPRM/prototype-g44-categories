const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');
const fs = require('fs');

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

// Mock data - Fair Market Products
const categories = [
    {
        id: "1",
        name: "Fair Trade Coffee & Tea",
        description: "Ethically sourced coffee and tea from fair trade cooperatives",
        parent_id: "",
        image_url: "https://placeholder.pagebee.io/api/plain/400/300?text=Coffee+%26+Tea&bg=8B4513&color=FFFFFF",
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "2",
        name: "Artisan Crafts",
        description: "Handmade products by skilled artisans from developing communities",
        parent_id: "",
        image_url: "https://placeholder.pagebee.io/api/plain/400/300?text=Artisan+Crafts&bg=CD853F&color=FFFFFF",
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "3",
        name: "Organic Textiles",
        description: "Sustainable and organic clothing and home textiles",
        parent_id: "",
        image_url: "https://placeholder.pagebee.io/api/plain/400/300?text=Organic+Textiles&bg=228B22&color=FFFFFF",
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "4",
        name: "Sustainable Home Goods",
        description: "Eco-friendly and ethically produced home and garden products",
        parent_id: "",
        image_url: "https://placeholder.pagebee.io/api/plain/400/300?text=Sustainable+Home&bg=2E8B57&color=FFFFFF",
        created_at: Date.now(),
        updated_at: Date.now()
    }
];

const products = [
    {
        id: "1",
        name: "Ethiopian Fair Trade Coffee",
        description: "Premium single-origin coffee from Ethiopian cooperatives, supporting local farmers",
        price: 24.99,
        image_url: "https://placeholder.pagebee.io/api/random/300/200",
        category_ids: ["1"],
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "2",
        name: "Costa Rican Organic Tea",
        description: "Certified organic tea leaves from sustainable Costa Rican farms",
        price: 18.99,
        image_url: "https://placeholder.pagebee.io/api/random/300/201",
        category_ids: ["1"],
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "3",
        name: "Handwoven Guatemalan Textiles",
        description: "Traditional Mayan weaving techniques passed down through generations",
        price: 89.99,
        image_url: "https://placeholder.pagebee.io/api/random/300/202",
        category_ids: ["2"],
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "4",
        name: "Organic Cotton T-Shirt",
        description: "100% organic cotton t-shirt made by fair trade certified manufacturers",
        price: 34.99,
        image_url: "https://placeholder.pagebee.io/api/random/300/203",
        category_ids: ["3"],
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "5",
        name: "Bamboo Kitchen Utensils Set",
        description: "Sustainable bamboo utensils made by artisan communities in Vietnam",
        price: 29.99,
        image_url: "https://placeholder.pagebee.io/api/random/300/204",
        category_ids: ["4"],
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "6",
        name: "Peruvian Alpaca Wool Scarf",
        description: "Luxurious alpaca wool scarf hand-knitted by Peruvian artisans",
        price: 79.99,
        image_url: "https://placeholder.pagebee.io/api/random/300/205",
        category_ids: ["3"],
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "7",
        name: "Indian Spice Collection",
        description: "Curated collection of organic spices from fair trade Indian cooperatives",
        price: 42.99,
        image_url: "https://placeholder.pagebee.io/api/random/300/206",
        category_ids: ["1"],
        created_at: Date.now(),
        updated_at: Date.now()
    },
    {
        id: "8",
        name: "Kenyan Soapstone Carvings",
        description: "Hand-carved soapstone sculptures by Kenyan artisans",
        price: 65.99,
        image_url: "https://placeholder.pagebee.io/api/random/300/207",
        category_ids: ["2"],
        created_at: Date.now(),
        updated_at: Date.now()
    }
];

// gRPC service implementation
const productService = {
    GetProducts: (call, callback) => {
        const { page = 1, limit = 10, search = '' } = call.request;

        // Simple pagination
        const start = (page - 1) * limit;
        const end = start + limit;

        let filteredProducts = products;

        // Simple search filter
        if (search) {
            filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        const paginatedProducts = filteredProducts.slice(start, end);

        callback(null, {
            products: paginatedProducts,
            total: filteredProducts.length,
            page: page,
            limit: limit
        });
    },

    GetProductsByCategory: (call, callback) => {
        const { category_id, page = 1, limit = 10, search = '' } = call.request;

        // Filter products by category
        let filteredProducts = products.filter(product =>
            product.category_ids.includes(category_id)
        );

        // Simple search filter
        if (search) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(search.toLowerCase()) ||
                product.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        // Simple pagination
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedProducts = filteredProducts.slice(start, end);

        callback(null, {
            products: paginatedProducts,
            total: filteredProducts.length,
            page: page,
            limit: limit
        });
    },

    GetCategories: (call, callback) => {
        const { parent_id = '' } = call.request;

        // Filter categories by parent_id if provided
        const filteredCategories = parent_id
            ? categories.filter(category => category.parent_id === parent_id)
            : categories;

        callback(null, {
            categories: filteredCategories
        });
    }
};

// Create and start the gRPC server
const server = new grpc.Server();
server.addService(productProto.ProductService.service, productService);

const PORT = process.env.PORT || 5000;
server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Failed to start server:', err);
        return;
    }

    console.log(`Product backend service running on port ${port}`);
    console.log('Available methods:');
    console.log('- GetProducts');
    console.log('- GetProductsByCategory');
    console.log('- GetCategories');
});
