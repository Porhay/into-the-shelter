FROM node:16-alpine AS builder
ENV NODE_ENV production

ENV REACT_APP_NODE_ENV $REACT_APP_NODE_ENV
ENV REACT_APP_GATEWAY_URL $REACT_APP_GATEWAY_URL
ENV REACT_APP_ACCOUNTS_URL $REACT_APP_ACCOUNTS_URL

# Add a work directory
WORKDIR /app

# Cache and Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
# Ensure all dependencies, including devDependencies, are installed
RUN npm install

# Copy app files
COPY . .

# Build the app
RUN npm run build

# Bundle static assets with nginx
FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production

ENV REACT_APP_NODE_ENV $REACT_APP_NODE_ENV
ENV REACT_APP_GATEWAY_URL $REACT_APP_GATEWAY_URL
ENV REACT_APP_ACCOUNTS_URL $REACT_APP_ACCOUNTS_URL

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]