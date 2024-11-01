#!/bin/sh
set -e

# Get the Docker GID from the host
DOCKER_GID=$(stat -c '%g' /var/run/docker.sock)

# Create docker group with the same GID as the host
groupmod -g "$DOCKER_GID" docker || true

# Add www-data to the docker group
usermod -aG docker www-data

# Fix permissions
chmod 666 /var/run/docker.sock
chown root:docker /var/run/docker.sock

# Execute the main container command
exec "$@"