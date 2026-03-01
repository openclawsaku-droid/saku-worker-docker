FROM --platform=linux/arm64 node:20-slim

# システムパッケージ インストール
RUN apt-get update && apt-get install -y \
    git curl ca-certificates jq \
    && rm -rf /var/lib/apt/lists/*

# OpenClaw をグローバルインストール
RUN npm install -g openclaw

WORKDIR /workspace

# 環境変数設定
ENV OPENCLAW_HOME=/workspace \
    NODE_ENV=production

# デフォルトファイル置き場（SOUL.md / USER.md / AGENTS.md をここに置く）
COPY defaults/ /defaults/

# Entrypoint スクリプトをコピー & 実行権限付与
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# ポート公開（環境変数で上書き可能）
EXPOSE 8001

ENTRYPOINT ["docker-entrypoint.sh"]
