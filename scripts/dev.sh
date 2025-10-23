#!/bin/bash

# Development startup script
echo "Starting Product Categories Microservices..."

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# Change to the project root directory (one level up from scripts)
cd "$SCRIPT_DIR/.."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use"
        return 1
    fi
    return 0
}

# Check if ports are available
echo "Checking ports..."
if ! check_port 5000; then
    echo "Backend port 5000 is in use. Please stop the service using this port."
    exit 1
fi

if ! check_port 4000; then
    echo "Middleware port 4000 is in use. Please stop the service using this port."
    exit 1
fi

if ! check_port 3000; then
    echo "Frontend port 3000 is in use. Please stop the service using this port."
    exit 1
fi

# Start backend service
echo "Starting backend service..."
cd app/backend
npm install
node server.js &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start middleware service
echo "Starting middleware service..."
cd ../middleware
npm install
node server.js &
MIDDLEWARE_PID=$!

# Wait for middleware to start
sleep 3

# Start frontend service
echo "Starting frontend service..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo ""
echo "All services started!"
echo "Backend (gRPC): http://localhost:5000"
echo "Middleware (REST): http://localhost:4000"
echo "Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $MIDDLEWARE_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for any process to exit
wait