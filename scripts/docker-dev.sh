#!/bin/bash

# Docker development script
echo "Starting Fair Market Products Microservices with Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start all services
echo "Building and starting all services..."
docker compose up --build

echo ""
echo "All services are running in Docker!"
echo ""
echo "Access your application:"
echo "Frontend: http://localhost:3000"
echo "Middleware API: http://localhost:4000"
echo "Backend gRPC: localhost:5000"
echo ""
echo "To stop all services: docker compose down"
