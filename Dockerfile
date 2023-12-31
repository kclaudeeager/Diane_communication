# Base image
FROM node:18-alpine AS base
WORKDIR /app
RUN npm install -g npm@latest
COPY package.json ./
RUN npm install 
COPY . .
# RUN npm run build
CMD ["npm", "run", "start"]
