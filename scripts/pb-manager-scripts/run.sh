#!/bin/bash

# Run the generate.sh script (assuming it's in the same directory)
./generate.sh

# Check if any docker-compose services are already running
if docker compose ps -q | grep .; then
  echo "Docker services are already running. No need to restart."
else
  echo "Starting docker-compose services..."
  docker compose up --build -d
fi

echo "Docker-compose services are running."
