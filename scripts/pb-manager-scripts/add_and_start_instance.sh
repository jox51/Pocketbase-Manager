#!/bin/bash

# Check if instance name is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <instance_name>"
    exit 1
fi

instance_name=$1

# Get current user
current_user=$(whoami)
echo "Current user: $current_user"

# Find next available PB number
next_pb=1
while grep -q "^PB${next_pb}=" .env 2>/dev/null; do
    ((next_pb++))
done

# Add new instance to .env file
echo "PB${next_pb}=\"${instance_name}\"" >> .env
echo "Added new PocketBase instance: PB${next_pb}=\"${instance_name}\""

# Regenerate docker-compose.yml and Caddyfile
./generate.sh

# Create instance directory if it doesn't exist
mkdir -p "./pocketbase/${instance_name}"

# Build and start the containers
docker compose up -d --build

# Wait for the container to be ready
echo "Waiting for PocketBase instance to start..."
max_attempts=30
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker ps | grep -q "${instance_name}"; then
        echo "PocketBase instance started successfully"
        
        # Restart Caddy to recognize the new instance
        echo "Restarting Caddy to recognize the new instance..."
        docker compose restart caddy
        
        # Wait a moment for Caddy to fully restart
        sleep 2
        
        echo "Setup complete! Access your instance at: http://localhost/${instance_name}/_/"
        exit 0
    fi
    ((attempt++))
    sleep 1
done

# Explicitly reload Caddy configuration
docker exec pb-manager-scripts-caddy-1 caddy reload --config /etc/caddy/Caddyfile

echo "Error: PocketBase instance failed to start properly"
exit 1