# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Copy all source code to the working directory
COPY . .

# Install dependencies
RUN npm install

# Expose the port that the app runs on
EXPOSE 5000

# Command to run your app using node
CMD ["node", "index.js"]
