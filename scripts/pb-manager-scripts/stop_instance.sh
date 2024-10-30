#!/bin/bash

# Check if instance name is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <instance_name>"
    exit 1
fi

instance_name=$1

# Check if the instance exists in docker-compose
if ! docker compose ps | grep -q "${instance_name}"; then
    echo "Instance '${instance_name}' is not running or doesn't exist."
    exit 1
fi

# Stop the container
docker compose stop ${instance_name}

echo "PocketBase instance '${instance_name}' has been stopped."

