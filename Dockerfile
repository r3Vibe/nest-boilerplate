# Use an official Node.js runtime as a parent image
FROM node:18-alpine AS base

# Set environment variables
ENV NODE_ENV=production

# Set the working directory in the container
WORKDIR /usr/src/app

# Install dependencies securely
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the NestJS application
RUN npm run build

# Final stage - Create a minimal production image
FROM node:18-alpine AS production

# Set environment variables
ENV NODE_ENV=production

# Set a non-root user for better security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Use the non-root user
USER appuser

# Set the working directory
WORKDIR /usr/src/app


# Copy the build artifacts and node_modules from the base stage
COPY --from=base /usr/src/app/dist ./dist
COPY --from=base /usr/src/app/node_modules ./node_modules
COPY --from=base /usr/src/app/package*.json ./

# Copy the .env file for environment configuration
COPY .env .env

# Expose the port the app runs on
EXPOSE 3000



# Use the CMD instruction to run the application
CMD ["node", "dist/main"]
