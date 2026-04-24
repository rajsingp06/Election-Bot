# Use node as the base image
FROM node:20-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Use a lightweight server to serve the static files
FROM node:20-slim

WORKDIR /app

# Install 'serve' package
RUN npm install -g serve

# Copy build files from the previous stage
COPY --from=build /app/dist ./dist

# Expose port 8080 (Cloud Run default)
EXPOSE 8080

# Serve the build folder on port 8080
CMD ["serve", "-s", "dist", "-l", "8080"]
