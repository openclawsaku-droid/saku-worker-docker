# Saku Worker Docker - Mac Studio マルチエージェント構築

Mac Studio 上に Docker を使って複数の OpenClaw エージェント（ぷーちゃん / ピノ）を立ち上げるプロジェクト。

## アーキテクチャ

```
Mac Studio (64GB)
  │
  └─ Docker (1コンテナ)
      ├─ Gateway (port 8001)
      ├─ Agent: ぷーちゃん
      └─ Agent: ピノ (port 8002 で別ポート公開)
```

**特徴:**
- 1つの OpenClaw Gateway で複数エージェントを管理
- 各エージェントは独立した Workspace を持つ
- Discord チャンネルで binding 分け（エージェントごとに別チャンネル対応）
- 公式の `docker-compose` + 自動セットアップ

## セットアップ手順

### 前提

- Docker Desktop インストール済み
- Node.js 20+（Docker 内で実行されるため不要）

### 1. ファイルを Mac Studio にコピー

```bash
scp -r /path/to/saku-worker-docker/ irietaro89706547@<mac-studio-ip>:~/saku-worker-docker
ssh irietaro89706547@<mac-studio-ip>
cd ~/saku-worker-docker
```

### 2. セットアップ実行

```bash
./setup.sh
```

**プロンプト:**
- ぷーちゃん Discord Bot Token を入力
- ピノ Discord Bot Token を入力

セットアップが自動で以下を実行します:
- `.env` ファイル生成
- Docker イメージ ビルド
- コンテナ起動

### 3. 確認

```bash
# コンテナ状態確認
docker compose ps

# ログ確認
docker compose logs -f pu-chan
docker compose logs -f pino

# Tailscale IP 確認（オプション）
tailscale ip -4
```

## アクセス URL

**ローカル:**
- ぷーちゃん Gateway: http://localhost:8001
- ピノ Gateway: http://localhost:8002

**Tailscale 経由:**
```bash
TAILSCALE_IP=$(tailscale ip -4)
# ぷーちゃん: http://${TAILSCALE_IP}:8001
# ピノ:       http://${TAILSCALE_IP}:8002
```

## ファイル構成

```
saku-worker-docker/
├── Dockerfile                 # OpenClaw + Node.js ベースイメージ
├── docker-compose.yml         # 2コンテナ定義
├── docker-entrypoint.sh      # 起動スクリプト
├── setup.sh                  # ワンコマンドセットアップ
├── .env.example              # 環境変数テンプレート
├── .gitignore                # Git 除外設定
├── defaults/                 # デフォルトファイル置き場
│   ├── SOUL.md              # エージェント キャラクター定義
│   └── MEMORY.md            # 長期記憶 テンプレート
├── pu-chan/                 # ぷーちゃん Workspace
│   ├── .openclaw/           # OpenClaw 設定（自動生成）
│   ├── memory/              # 記憶ファイル
│   ├── SOUL.md              # キャラクター定義
│   └── MEMORY.md            #