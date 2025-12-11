# Use an official Node.js runtime as a parent image (Debian based)
FROM node:18-bullseye

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Create the data directory for persistence
RUN mkdir -p data

# Expose the port the app runs on
EXPOSE 3000

# Define volume for data persistence (cache and usage)
VOLUME ["/app/data"]

# Command to run the application
CMD ["npm", "start"]
