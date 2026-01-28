FROM node:20-alpine

WORKDIR /usr/src/app

# Install dependencies based on package-lock first for deterministic installs.
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy all source files (after dependencies to leverage Docker cache).
COPY . .

# Expose the application port
EXPOSE 3000

# Set NODE_ENV default to production unless overridden
ENV NODE_ENV=production

ENTRYPOINT ["npm", "start"]
