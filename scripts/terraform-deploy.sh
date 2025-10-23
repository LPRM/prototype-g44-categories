#!/bin/bash

# Terraform deployment script for Fair Market Products Microservices

set -e

TERRAFORM_DIR="terraform"

echo "Deploying Fair Market Products Microservices with Terraform..."

# Check if Terraform is installed
if ! command -v terraform &> /dev/null; then
    echo "Terraform is not installed. Please install Terraform first."
    echo "Visit: https://developer.hashicorp.com/terraform/downloads"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

cd $TERRAFORM_DIR

# Initialize Terraform
echo "Initializing Terraform..."
terraform init

# Plan the deployment
echo "Planning deployment..."
terraform plan

# Apply the configuration
echo "Deploying infrastructure..."
terraform apply -auto-approve

# Show outputs
echo ""
echo "Deployment completed!"
echo ""
echo "Service Information:"
terraform output

echo ""
echo "Access your application:"
echo "Frontend: http://localhost:3000"
echo "API: http://localhost:4000"
echo "Health Check: http://localhost:4000/health"
echo ""
echo "Management commands:"
echo "View status: terraform show"
echo "Destroy: terraform destroy"
echo "Plan changes: terraform plan"
