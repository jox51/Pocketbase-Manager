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

# Get the next available PB number regardless of whether a port is provided
read next_pb_number next_port <<< $(get_next_pb_and_port)

# Check if a specific port is provided
if [ "$#" -eq 2 ]; then
    specific_port=$2
    # Validate the provided port (it should be a number between 1024 and 65535)
    if ! [[ $specific_port =~ ^[0-9]+$ ]] || [ "$specific_port" -lt 1024 ] || [ "$specific_port" -gt 65535 ]; then
        echo "Error: Port should be a number between 1024 and 65535."
        exit 1
    fi
else
    specific_port=$next_port
fi

# Check for duplicates before adding to .env
# check_for_duplicates() {
#     local new_instance=$1
#     local new_port=$2
#     local duplicate_found=false
    
#     while IFS='=' read -r key value; do
#         if [[ $key =~ ^PB[0-9]+$ ]]; then
#             existing_instance=$(echo $value | cut -d':' -f1 | tr -d '"' | tr -d '[:space:]')
#             existing_port=$(echo $value | cut -d':' -f2 | tr -d '"' | tr -d '[:space:]')
#             if [[ "$existing_instance" == "$new_instance" && "$existing_port" == "$new_port" ]]; then
#                 duplicate_found=true
#                 break
#             fi
#         fi
#     done < .env
#     echo $duplicate_found
# }

# Check for duplicates before adding to .env
# if [[ $(check_for_duplicates "$instance_name" "$specific_port") == "true" ]]; then
#     echo "Error: Instance name '$instance_name' with port '$specific_port' already exists. Skipping."
#     exit 1
# fi

# Remove any existing container with the same name
docker rm -f ${instance_name} 2>/dev/null || true

# Add the new instance to the .env file
temp_file=$(mktemp)
while IFS='=' read -r key value || [ -n "$key" ]; do
    if [[ $key =~ ^PB[0-9]+$ ]]; then
        echo "$key=$value" >> "$temp_file"
    fi
done < .env
echo "PB${next_pb_number}=\"${instance_name}:${specific_port}\"" >> "$temp_file"
mv "$temp_file" .env
echo "Added new PocketBase instance: PB${next_pb_number}=\"${instance_name}:${specific_port}\""

# Run generate.sh to update docker-compose.yml and Caddyfile
./generate.sh

# Format the Caddyfile to ensure no warnings
docker exec pb-manager-scripts-caddy-1 caddy fmt --overwrite /etc/caddy/Caddyfile

# Start only the new service and update Caddy
docker compose up -d --no-deps ${instance_name}
docker compose up -d --no-deps caddy

# Allow containers to initialize
sleep 5

# Verify the new instance started by checking recent logs
docker logs --tail 10 ${instance_name}

# Explicitly reload Caddy configuration
docker exec pb-manager-scripts-caddy-1 caddy reload --config /etc/caddy/Caddyfile
echo "Caddy configuration reloaded."

echo "New PocketBase instance '${instance_name}' has been added and started on port ${specific_port}."
