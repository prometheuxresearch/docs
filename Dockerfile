FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Create production environment file if not exists
RUN if [ ! -f .env.local ]; then cp env.local.example .env.local; fi

# Expose port
EXPOSE 3000

# Start the application in production mode with the API server
CMD ["pnpm", "start", "--host", "0.0.0.0", "--port", "3000"]
