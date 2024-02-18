FROM node:alpine AS shelter-client
WORKDIR /usr/src/shelter-client

COPY package*.json ./
COPY tsconfig.json ./
COPY public/ ./public
COPY src/ ./src
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]

