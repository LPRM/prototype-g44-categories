#!/bin/bash

echo "Testing Product Categories Microservices..."

# Test middleware health
echo "1. Testing middleware health..."
curl -s http://localhost:3001/health | jq '.' || echo "Middleware health check failed"

echo -e "\n2. Testing categories API..."
curl -s http://localhost:3001/api/categories | jq '.categories | length' || echo "Categories API failed"

echo -e "\n3. Testing products API..."
curl -s http://localhost:3001/api/products | jq '.products | length' || echo "Products API failed"

echo -e "\n4. Testing products by category API..."
curl -s http://localhost:3001/api/products/category/1 | jq '.products | length' || echo "Products by category API failed"

echo -e "\n5. Testing frontend accessibility..."
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo "Frontend is accessible at http://localhost:3000"
else
    echo "Frontend is not accessible"
fi

echo -e "\n6. Testing gRPC backend (via middleware)..."
if curl -s http://localhost:3001/api/products | jq -e '.products' > /dev/null; then
    echo "gRPC backend is working (communicating via middleware)"
else
    echo "gRPC backend communication failed"
fi

echo -e "\nAll tests completed!"
echo -e "\nAccess your application at:"
echo "Frontend: http://localhost:3000"
echo "API: http://localhost:3001/api/"
