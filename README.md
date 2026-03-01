# Saku Worker Docker 🐾

Mac Studio 上で複数の OpenClaw エージェント（ぷーちゃん / ピノ）を Docker で管理するプロジェクト。

## アーキテクチャ

```
Mac Studio (64GB)
  ├─ ぷーちゃん (Port 8001)
  ├─ ピノ (Port 8002)
  ├─ openclaw-router (Port 8080) — LLM API ルーター
  ├─ dashboard-api (Port 9000) — 管理 API
  └─ dashboard-ui (Port 3000) — Web ダッシュボード
```

## 前提条件

- **Docker Desktop** (Mac Intel/Apple Silicon 両対応)
- **Node.js** 22+ (Docker 内で実行されるため不要)
- **Discord Bot Account** (ぷーちゃん / ピノ用の 2 つ)
- **Tailscale** (オプション、遠隔アクセス用)

## セットアップ（3 ステップ）

### 1️⃣ リポジトリをクローン

```bash
git clone https://github.com/openclawsaku-droid/saku-worker-docker.git
cd saku-worker-docker
```

### 2️⃣ セットアップスクリプトを実行

```bash
./setup.sh
```

**プロンプト（対話型）:**
- ぷーちゃん Discord Bot Token（必須）
- ピノ Discord Bot Token（必須）
- ANTHROPIC_API_KEY（オプション）
- OPENAI_API_KEY（オプション）
- GEMINI_API_KEY（オプション）
- Tailscale IP（オプション、デフォルト: localhost）

### 3️⃣ ダッシュボードを開く

```
http://localhost:3000
```

---

## Discord Bot Token 取得方法

1. [Discord Developer Portal](https://discord.com/developers/applications) を開く
2. **New Application** をクリック
3. アプリ名を入力（例: `pu-chan` / `pino`）
4. **Bot** タブ → **Add Bot**
5. **TOKEN** をコピー（セットアップスクリプトに貼り付け）
6. **OAuth2** → **Scopes** で `bot` を選択
7. **Permissions** で必要な権限を選択（チャット送信、メッセージ読み取りなど）
8. 生成された URL をサーバーに招待

---

## ダッシュボード機能

### 📊 ホーム
- エージェントの実行状態（Running/Stopped）
- ワンクリックで Start/Stop/Restart

### 📋 ログ
- 直近 200 行のコンテナログ
- リアルタイム更新

### 🔀 Router
- OpenClaw Router のヘルスチェック
- 利用可能なモデル一覧

---

## よく使うコマンド

```bash
# ステータス確認
docker compose ps

# ログ確認（ぷーちゃん）
docker compose logs -f pu-chan

# ログ確認（ピノ）
docker compose logs -f pino

# ログ確認（Router）
docker compose logs -f saku-router

# 再起動
docker compose restart

# 停止
docker compose down

# 削除して再構築
docker compose down && docker compose up -d
```

---

## ファイル構成

```saku-worker-docker/
├── Dockerfile                    # OpenClaw + Node.js 22 ベースイメージ
├── docker-compose.yml            # 5 コンテナ統合管理
├── docker-entrypoint.sh         # エージェント起動スクリプト
├── setup.sh                     # セットアップ自動化
├── .env.example                 # 環境変数テンプレート
├── .gitignore                   # Git除外リスト
├── README.md                    # このファイル
│
├── dashboard/                   # Web管理画面
│   ├── server/                  # Express API
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.js
│   │       └── routes/
│   │           ├── agents.js      # コンテナ制御
│   │           ├── logs.js        # ログ取得
│   │           ├── router.js      # Router状態
│   │           └── config.js      # 設定管理
│   │
│   └── ui/                      # Next.js フロントエンド
│       ├── Dockerfile
│       ├── package.json
│       ├── next.config.js
│       └── src/
│           ├── pages/
│           │   ├── index.tsx      # ダッシュボード
│           │   ├── logs/          # ログビューア
│           │   └── router/        # Router情報
│           └── components/        # UIコンポーネント
│
├── pu-chan/                     # ぷーちゃん Workspace
│   ├── SOUL.md                  # キャラクター設定
│   ├── MEMORY.md                # 長期記憶
│   └── memory/                  # 動的メモリ
│
├── pino/                        # ピノ Workspace
│   ├── SOUL.md
│   ├── MEMORY.md
│   └── memory/
│
├── defaults/                    # 初期化テンプレート
│   ├── SOUL.md
│   └── MEMORY.md
│
└── shared/                      # 共有リソース
    ├── logs/                    # コンテナログ集約
    └── config/                  # 共有設定
```

---

## トラブルシューティング

### ❌ Docker が見つからない

```bash
# インストール確認
docker --version
docker compose version

# Docker Desktop を再起動
```

### ❌ ポート競合エラー

```bash
# 使用中のポート確認
lsof -i :3000  # Dashboard
lsof -i :9000  # API
lsof -i :8001  # ぷーちゃん
lsof -i :8002  # ピノ

# 既存プロセスを停止
kill -9 <PID>
```

### ❌ Discord Token エラー

- Token が正しくコピーされているか確認
- bot が正しいサーバーに招待されているか確認
- Token に有効期限がないか確認

### ❌ Tailscale でアクセスできない

```bash
# Tailscale 接続確認
tailscale status

# Mac Studio の Tailscale IP を確認
tailscale ip -4

# セットアップスクリプトを再実行し、IP を入力
./setup.sh
```

---

## 拡張・カスタマイズ

### 新しいエージェントを追加

1. 新しいディレクトリを作成

```bash
mkdir -p new-agent/memory
```

2. `docker-compose.yml` にサービスを追加

```yaml
new-agent:
  build: .
  container_name: new-agent
  ports:
    - "8003:8003"
  volumes:
    - ./new-agent:/workspace
    - ./shared/logs:/logs
  environment:
    - DISCORD_TOKEN=${NEW_AGENT_DISCORD_TOKEN}
    - OPENCLAW_PORT=8003
    - AGENT_NAME=new-agent
    - OPENCLAW_ROUTER_URL=http://router:8080/v1
  networks:
    - saku-worker-net
```

3. `.env` に Token を追記

4. 再起動

```bash
docker compose up -d new-agent
```

---

## ライセンス

MIT

---

*Built by Saku Worker Team 🐾*

### ❌ Docker Socket エラー（dashboard-api が起動しない）

```bash
# エラー例: connect ENOENT /var/run/docker.sock

# Mac Docker Desktop の Socket パス確認
ls -la /var/run/docker.sock
# または
ls -la ~/.docker/run/docker.sock

# docker-compose.yml の volumes を修正
#   /var/run/docker.sock:/var/run/docker.sock
# → 上記でうまくいかない場合:
#   ${HOME}/.docker/run/docker.sock:/var/run/docker.sock
```
