#!/bin/bash
set -e

# Wait for InfluxDB to be ready
# The entrypoint runs this with the server in the background, but we need to wait for it to be responsive.
# We also need to provide auth credentials for the CLI commands.
# We can use the admin token we set.

# Wait loop
until influx ping; do
  echo "Waiting for InfluxDB..."
  sleep 1
done

# Create the extra 'alerts' bucket (network_metrics is created by init vars)
# Use the admin token and org from env vars (passed via docker-compose or defaults)
# We assume the CLI picks up INFLUX_TOKEN if set, or we pass it explicitly.
# docker-entrypoint.sh usually sets up a config profile for the admin user.

echo "Creating alerts bucket..."
influx bucket create \
  --name alerts \
  --org network-analyzer \
  --retention 90d \
  --token "${DOCKER_INFLUXDB_INIT_ADMIN_TOKEN}" \
  || echo "Bucket creation failed or likely already exists"

# We don't need to create a new auth token if we just use the admin token for the app.
# The app is configured to use 'my-super-secret-auth-token' which IS the admin token now.
