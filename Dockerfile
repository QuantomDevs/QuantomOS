# Multi-architecture build support
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETARCH
ARG TARGETVARIANT

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

# Re-declare build arguments for this stage
ARG TARGETPLATFORM
ARG BUILDPLATFORM
ARG TARGETARCH
ARG TARGETVARIANT

WORKDIR /app
ENV NODE_ENV=production
EXPOSE 2022

# Install runtime dependencies and Python 3 for ARM architectures
RUN apt-get update && \
    apt-get install -y iputils-ping lm-sensors ca-certificates && \
    # Use build arguments for reliable architecture detection
    if [ "$TARGETARCH" = "arm" ] || [ "$TARGETARCH" = "arm64" ]; then \
      echo "Installing Python 3 for ARM architecture ($TARGETARCH${TARGETVARIANT})" && \
      apt-get install -y python3 python3-pip; \
    fi && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Display build information for debugging
RUN echo "Built for platform: ${TARGETPLATFORM}" && \
    echo "Architecture: ${TARGETARCH}${TARGETVARIANT}" && \
    echo "Build platform: ${BUILDPLATFORM}"

# Copy built files from build stage
COPY --from=build /usr/src/app/dist/backend/config ../config
COPY --from=build /usr/src/app/dist/backend/index.js ./
COPY --from=build /usr/src/app/dist/backend/package.json ./
COPY --from=build /usr/src/app/dist/frontend ./public

# Install only production dependencies with architecture-specific optimizations
RUN if [ "$TARGETARCH" = "arm" ] && [ "$TARGETVARIANT" = "v7" ]; then \
      # For ARMv7, use fewer concurrent jobs to avoid memory issues
      npm i --omit-dev --omit-optional --maxsockets=1; \
    else \
      npm i --omit-dev --omit-optional; \
    fi

CMD [ "node", "index.js" ]
