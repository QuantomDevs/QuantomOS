# Build Stage
FROM node:lts-slim AS build

WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies needed for build)
RUN npm install

# Copy source code and build configurations
COPY src ./src
COPY tsconfig*.json ./
COPY esbuild.config.js ./
COPY vite.config.ts ./

# Build both backend and frontend
RUN npm run build

# Deploy Stage (Backend)
FROM node:lts-slim AS backend-deploy

WORKDIR /app
ENV NODE_ENV=production
EXPOSE 2022

# Install runtime dependencies and Python 3 for ARM
RUN apt-get update && \
    apt-get install -y iputils-ping lm-sensors ca-certificates && \
    ARCH=$(uname -m) && \
    echo "Detected architecture: $ARCH" && \
    if [ "$ARCH" = "armv7l" ] || [ "$ARCH" = "armhf" ] || [ "$ARCH" = "arm" ]; then \
      echo "Installing Python 3 for ARM architecture" && \
      apt-get install -y python3 python3-pip; \
    fi && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy built files from build stage
COPY --from=build /usr/src/app/dist/backend/config ../config
COPY --from=build /usr/src/app/dist/backend/index.js ./
COPY --from=build /usr/src/app/dist/backend/package.json ./
COPY --from=build /usr/src/app/dist/frontend ./public

# Install only production dependencies
RUN npm i --omit-dev --omit-optional

CMD [ "node", "index.js" ]
