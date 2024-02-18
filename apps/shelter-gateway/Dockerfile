FROM node:alpine AS shelter-gateway
WORKDIR /usr/src/shelter-gateway
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build shelter-gateway
CMD ["node", "dist/apps/shelter-gateway/main"]