FROM node:22-slim
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json .
RUN npm install
COPY src/ ./src/
EXPOSE 9000
CMD ["node", "src/index.js"]
