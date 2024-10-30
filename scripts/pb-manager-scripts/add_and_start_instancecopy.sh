#!/bin/bash

# Function to get the next available PB number and the highest port number
get_next_pb_and_port() {
    local max_number=0
    local max_port=8080  # Default starting port if no entries exist
    while IFS='=' read -r key value; do
        if [[ $key =~ ^PB[0-9]+$ ]]; then
            number=${key#PB}
            port=$(echo $value | cut -d':' -f2 | tr -d '"' | tr -d '[:space:]')
            echo "DEBUG: Found entry - Number: $number, Port: $port" >&2
            # Find the highest PB number
            if (( number > max_number )); then
                max_number=$number
            fi
            # Find the highest port number and increment it
            if (( port > max_port )); then
                max_port=$port
            fi
        fi
    done < .env
    echo "DEBUG: Final max_number: $max_number, max_port: $max_port" >&2
    echo $((max_number + 1)) $((max_port + 1))
}

# Check if instance name is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <instance_name> [port]"
    exit 1
fi

instance_name=$1

# Validate instance name (alphanumeric and underscores only)
if ! [[ $instance_name =~ ^[a-zA-Z0-9_]+$ ]]; then
    echo "Error: Instance name should contain only alphanumeric characters and underscores."
    exit 1
fi

# Check if a specific port is provided
if [ "$#" -eq 2 ]; then
    specific_port=$2
    # Validate the provided port (it should be a number between 1024 and 65535)
    if ! [[ $specific_port =~ ^[0-9]+$ ]] || [ "$specific_port" -lt 1024 ] || [ "$specific_port" -gt 65535 ]; then
        echo "Error: Port should be a number between 1024 and 65535."
        exit 1
    fi
else
    # Get the next available PB number and port if no port is provided
    read next_pb_number next_port <<< $(get_next_pb_and_port)
    specific_port=$next_port
fi

# Add the new instance to the .env file
echo "PB${next_pb_number}=\"${instance_name}:${specific_port}\"" >> .env

echo "Added new PocketBase instance: PB${next_pb_number}=\"${instance_name}:${specific_port}\""

# Run generate.sh to update docker-compose.yml and Caddyfile
./generate.sh

# Format the Caddyfile to ensure no warnings
docker exec -it pb-manager-scripts-caddy-1 caddy fmt --overwrite /etc/caddy/Caddyfile

docker network inspect pb-manager-scripts_pbmi_net >/dev/null 2>&1 || docker network create pb-manager-scripts_pbmi_net


# Start only the new service and update Caddy
docker compose up -d --no-deps ${instance_name}
docker compose up -d --no-deps caddy

# Explicitly reload Caddy to ensure it picks up the changes
docker exec -it pb-manager-scripts-caddy-1 caddy reload --config /etc/caddy/Caddyfile

echo "New PocketBase instance '${instance_name}' has been added and started on port ${specific_port}."
