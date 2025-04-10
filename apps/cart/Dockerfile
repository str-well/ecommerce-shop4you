FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/cart/package*.json ./apps/cart/

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "dev:cart"]
