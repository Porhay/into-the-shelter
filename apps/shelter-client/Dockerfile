FROM node:14-alpine AS builder
# ENV NODE_ENV production Removed this line to ensure devDependencies are installed

ARG REACT_APP_NODE_ENV
ENV REACT_APP_NODE_ENV $REACT_APP_NODE_ENV

ARG REACT_APP_ACCOUNTS_URL
ENV REACT_APP_ACCOUNTS_URL $REACT_APP_ACCOUNTS_URL

ARG REACT_APP_GATEWAY_URL
ENV REACT_APP_GATEWAY_URL $REACT_APP_GATEWAY_URL

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

ARG REACT_APP_NODE_ENV
ENV REACT_APP_NODE_ENV $REACT_APP_NODE_ENV

ARG REACT_APP_ACCOUNTS_URL
ENV REACT_APP_ACCOUNTS_URL $REACT_APP_ACCOUNTS_URL

ARG REACT_APP_GATEWAY_URL
ENV REACT_APP_GATEWAY_URL $REACT_APP_GATEWAY_URL

# Copy built assets from builder
COPY --from=builder /app/build /usr/share/nginx/html

# Add your nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 3000

# Start nginx
CMD ["nginx", "-g", "daemon off;"]