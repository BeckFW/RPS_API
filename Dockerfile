# Stage 1: Python setup
FROM python:3.11 as build

# Set working directory
WORKDIR /app

# Set up a virtual environment
RUN python3 -m venv /app/venv

# Activate the virtual environment
ENV PATH="/app/venv/bin:$PATH"

# Install mediapipe, pillow and numpy
RUN pip install mediapipe pillow numpy

# Stage 2: Node.js setup
FROM node:20-slim

# Install Python and other dependencies
RUN apt-get update && apt-get install -y python3 make g++ ffmpeg libsm6 libxext6 

# Set working directory
WORKDIR /app

# Copy virtual environment from build stage
COPY --from=build /app/venv /venv

# Set PATH to include Python virtual environment
ENV PATH="/venv/bin:$PATH"

ENV PYTHONPATH="/venv/lib/python3.11/site-packages:$PYTHONPATH"

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port if necessary
EXPOSE 3100

# Command to run the application
CMD ["node", "index.js"]