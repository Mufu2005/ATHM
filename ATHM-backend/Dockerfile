# File: ATHM-backend/Dockerfile

FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Open the port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]