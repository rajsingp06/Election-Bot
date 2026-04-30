# Step 1: Build the Vite React app
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Copy the build output to replace the default nginx contents.
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx configuration
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Cloud Run sets the PORT environment variable. Nginx alpine image with templates 
# will automatically substitute ${PORT} in our template when starting up.
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
