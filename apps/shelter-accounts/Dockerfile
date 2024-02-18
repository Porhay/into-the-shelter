FROM node:alpine AS shelter-accounts
WORKDIR /usr/src/shelter-accounts
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build shelter-accounts
CMD ["node", "dist/apps/shelter-accounts/main"]