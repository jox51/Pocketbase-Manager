#!/bin/bash

echo "Checking status of all PocketBase instances..."
echo "----------------------------------------"

# Get all containers with our prefix
containers=$(docker ps -a --filter "name=pb-" --format "{{.Names}}")

if [ -z "$containers" ]; then
    echo "No PocketBase instances found."
    exit 0
fi

for container in $containers; do
    # Remove 'pb-' prefix from name
    name=${container#pb-}
    
    # Check if container is running
    is_running=$(docker inspect --format='{{.State.Running}}' "$container" 2>/dev/null)
    
    if [ "$is_running" = "true" ]; then
        # Get the port mapping
        port=$(docker inspect --format='{{range $p, $conf := .NetworkSettings.Ports}}{{if eq $p "8080/tcp"}}{{(index $conf 0).HostPort}}{{end}}{{end}}' "$container")
        
        # Check if PocketBase is responding
        if curl -s "http://localhost:${port}/api/health" > /dev/null 2>&1; then
            echo "${name}: Running"
        else
            echo "${name}: Container running but PocketBase not responding"
        fi
    else
        echo "${name}: Stopped"
    fi
done

echo "----------------------------------------"

