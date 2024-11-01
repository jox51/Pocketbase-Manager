#!/bin/bash

# Check if instance name is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <instance_name>"
    exit 1
fi

instance_name=$1

# Create a temporary file
temp_file=$(mktemp)

# Copy all entries except the one we want to delete
while IFS='=' read -r key value; do
    if [[ $key =~ ^PB[0-9]+$ ]]; then
        current_instance=$(echo $value | cut -d':' -f1 | tr -d '"' | tr -d '[:space:]')
        if [ "$current_instance" != "$instance_name" ]; then
            echo "$key=$value" >> "$temp_file"
        fi
    fi
done < .env

# Replace the original .env with our cleaned up version
mv "$temp_file" .env

# Stop and remove the container
docker compose stop ${instance_name}
docker compose rm -f ${instance_name}

# Delete the instance's pocketbase folder
if [ -d "pocketbase/${instance_name}" ]; then
    rm -rf "pocketbase/${instance_name}"
    echo "Deleted pocketbase folder for instance '${instance_name}'"
else
    echo "No pocketbase folder found for instance '${instance_name}'"
fi

# Run generate.sh to update docker-compose.yml and Caddyfile
./generate.sh

# Update Caddy configuration
docker exec pb-manager-scripts-caddy-1 caddy fmt --overwrite /etc/caddy/Caddyfile
docker compose up -d --no-deps caddy
docker exec pb-manager-scripts-caddy-1 caddy reload --config /etc/caddy/Caddyfile

echo "PocketBase instance '${instance_name}' has been removed."
