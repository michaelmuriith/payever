# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json yarn.lock ./
RUN yarn

# Copy the source code
COPY . .

# # Build the application
# RUN yarn build

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["yarn", "start:dev"]
