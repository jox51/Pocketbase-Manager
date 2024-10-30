#!/bin/bash

# Check if instance name is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <instance_name>"
    exit 1
fi

instance_name=$1

# Validate instance name (alphanumeric and underscores only)
if ! [[ $instance_name =~ ^[a-zA-Z0-9_]+$ ]]; then
    echo "Error: Instance name should contain only alphanumeric characters and underscores."
    exit 1
fi

# Check if the instance exists in .env
instance_exists=false
while IFS='=' read -r key value; do
    if [[ $value =~ \"$instance_name: ]]; then
        instance_exists=true
        break
    fi
done < .env

if [ "$instance_exists" = false ]; then
    echo "Error: Instance '$instance_name' not found in .env file."
    exit 1
fi

# Start the stopped instance using docker compose
echo "Starting PocketBase instance '${instance_name}'..."
docker compose start ${instance_name}
docker compose start caddy

# Allow containers to initialize
sleep 5

# Verify the instance started by checking recent logs
docker logs --tail 10 ${instance_name}

# Explicitly reload Caddy configuration
docker exec pb-manager-scripts-caddy-1 caddy reload --config /etc/caddy/Caddyfile
echo "Caddy configuration reloaded."

echo "PocketBase instance '${instance_name}' has been restarted."
