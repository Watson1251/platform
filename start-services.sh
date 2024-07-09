#!/bin/bash

# Start MongoDB
mongod --bind_ip_all --logpath /var/log/mongodb.log --fork

# Source NVM
export NVM_DIR="/root/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use default

# Activate the conda environment
source /opt/conda/bin/activate deep

# Change to the platform directory
cd /platform

# Start Angular application
ng serve --host 0.0.0.0 --port 4200 &

# # Start Node.js server
nodemon backend/server.js &

# Run the deepfake processing script
# cd engine/df_video
# uvicorn main:app --reload --host 0.0.0.0 --port 8000 &

# Keep the script running
wait
