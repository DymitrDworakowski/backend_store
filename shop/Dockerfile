FROM node:20-alpine

WORKDIR /app

COPY shop/package*.json ./
RUN npm run start --only=production

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
