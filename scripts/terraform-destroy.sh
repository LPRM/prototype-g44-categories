#!/bin/bash

# Terraform destroy script for Fair Market Products Microservices

set -e

TERRAFORM_DIR="terraform"

echo "Destroying Fair Market Products Microservices infrastructure..."

cd $TERRAFORM_DIR

# Check if Terraform is initialized
if [ ! -d ".terraform" ]; then
    echo "Terraform not initialized. Run terraform-deploy.sh first."
    exit 1
fi

# Plan the destruction
echo "Planning destruction..."
terraform plan -destroy

# Confirm destruction
echo ""
echo "This will destroy all infrastructure including:"
echo "   - Docker containers"
echo "   - Docker images"
echo "   - Docker network"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Destruction cancelled."
    exit 0
fi

# Apply the destruction
echo "Destroying infrastructure..."
terraform destroy -auto-approve

echo ""
echo "Infrastructure destroyed successfully!"
echo ""
echo "Clean up Docker resources:"
echo "docker system prune -f"
