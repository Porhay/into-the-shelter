# Stage 1: Building the application
FROM node:16-alpine as builder
WORKDIR /usr/src/shelter-gateway

# Copying package files and installing dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm install

# Copying the rest of the application
COPY . .

# Generating Prisma client specifically for the target platform
# Ensuring that Prisma knows we're targeting linux-musl-arm64
RUN npx prisma generate --schema=./libs/common/src/database/prisma/schema.prisma


# Building the application
RUN npm run build shelter-gateway

# Stage 2: Setting up the production environment
FROM node:16-alpine
WORKDIR /usr/src/shelter-gateway

# Copying necessary files from the builder stage
COPY --from=builder /usr/src/shelter-gateway/dist ./dist
COPY --from=builder /usr/src/shelter-gateway/node_modules ./node_modules
COPY --from=builder /usr/src/shelter-gateway/package*.json ./
COPY --from=builder /usr/src/shelter-gateway/libs/common/src/database/prisma/schema.prisma ./libs/common/src/database/prisma/
COPY --from=builder /usr/src/shelter-gateway/libs/common/src/database/prisma/generated ./libs/common/src/database/prisma/generated

RUN mkdir -p /usr/src/shelter-gateway/data/images

# Installing only production dependencies (if any additional ones are needed)
# This step might be redundant if all dependencies are already included in the node_modules copied from the builder
RUN npm install --production

# Exposing the port your app runs on
EXPOSE 8001

# Starting the application
CMD ["node", "dist/apps/shelter-gateway/main"]
