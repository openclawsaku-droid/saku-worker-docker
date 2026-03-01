FROM --platform=linux/arm64 node:22-slim

RUN apt-get update && apt-get install -y \
    git curl ca-certificates jq \
    && rm -rf /var/lib/apt/lists/*

RUN npm install -g openclaw

WORKDIR /workspace

ENV OPENCLAW_HOME=/workspace \
    NODE_ENV=production

COPY defaults/ /defaults/
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 8001

ENTRYPOINT ["docker-entrypoint.sh"]
