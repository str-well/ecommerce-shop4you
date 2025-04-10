FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY apps/store/package*.json ./apps/store/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev:store"]
