#!/bin/sh

# Get instance name from container hostname
INSTANCE_NAME=$(hostname)

# Start PocketBase with the correct data directory and port 8080
exec /pb/pocketbase serve \
    --dir /pocketbase/${INSTANCE_NAME} \
    --http 0.0.0.0:8080
