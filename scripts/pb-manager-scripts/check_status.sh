#!/bin/bash

echo "Checking status of all PocketBase instances..."
echo "----------------------------------------"

# Get all containers matching our instance pattern (removing any prefix requirements)
containers=$(docker ps -a --format "{{.Names}}")

if [ -z "$containers" ]; then
    echo "No PocketBase instances found."
    exit 0
fi

for container in $containers; do
    # Skip the Caddy container
    if [[ "$container" == *"caddy"* ]]; then
        continue
    fi
    
    # Check if container is running
    is_running=$(docker inspect --format='{{.State.Running}}' "$container" 2>/dev/null)
    
    if [ "$is_running" = "true" ]; then
        # Check if PocketBase is responding using the new URL pattern
        if curl -s "http://localhost/${container}/api/health" > /dev/null 2>&1; then
            echo "${container}: Running"
        else
            echo "${container}: Container running but PocketBase not responding"
        fi
    else
        echo "${container}: Stopped"
    fi
done

echo "----------------------------------------"

