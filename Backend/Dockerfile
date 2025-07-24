FROM node:23-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy everything including backend code and .env
COPY . .



EXPOSE 3000

CMD ["node", "index.js"]

