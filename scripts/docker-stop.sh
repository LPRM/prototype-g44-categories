#!/bin/bash

# Docker stop script
echo "Stopping Fair Market Products Microservices..."

# Stop and remove containers
docker compose down

# Optional: Remove volumes and images
if [ "$1" = "--clean" ]; then
    echo "Cleaning up Docker resources..."
    docker compose down -v --rmi all
    docker system prune -f
fi

echo "All services stopped!"
