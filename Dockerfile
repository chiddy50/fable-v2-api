# Use the official Node.js image as base
FROM node:18.18.0

RUN npm install -g prisma

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

RUN npm run build
RUN prisma generate

# Expose the port that your app runs on
EXPOSE 3000

# Command to run your application
CMD ["npm", "start"]
