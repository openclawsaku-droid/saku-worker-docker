#!/bin/bash
set -e

WORKSPACE_DIR="/workspace"
LOG_DIR="/logs"
AGENT="${AGENT_NAME:-openclaw-agent}"
PORT="${OPENCLAW_PORT:-8001}"

echo "=== OpenClaw Agent: ${AGENT} ==="
echo "Port:      ${PORT}"
echo "Workspace: ${WORKSPACE_DIR}"
echo "Log:       ${LOG_DIR}/${AGENT}.log"
echo "=================================="

# ===== Phase 1: 初期化 =====
mkdir -p "$WORKSPACE_DIR/memory" "$LOG_DIR"

# デフォルトファイル配置（既存は上書きしない）
if [ -d /defaults ]; then
    for f in /defaults/*; do
        [ ! -e "$f" ] && continue
        fname=$(basename "$f")
        if [ ! -e "$WORKSPACE_DIR/$fname" ]; then
            echo "[init] 配置: $fname"
            cp -r "$f" "$WORKSPACE_DIR/$fname"
        else
            echo "[init] スキップ（既存）: $fname"
        fi
    done
fi

# ===== Phase 2: OpenClaw 設定 =====
export OPENCLAW_HOME="$WORKSPACE_DIR"
export OPENCLAW_STATE_DIR="$WORKSPACE_DIR/.openclaw"
mkdir -p "$OPENCLAW_STATE_DIR"

# Discord Bot Token を登録（冪等: 毎回 upsert）
if [ -n "$DISCORD_TOKEN" ]; then
    echo "[config] Discord Token を設定中..."
    openclaw channels add \
        --channel discord \
        --token "$DISCORD_TOKEN" 2>&1 | head -5 || true
    echo "[config] Discord 設定完了"
else
    echo "[warn] DISCORD_TOKEN が未設定です"
fi

# ===== Phase 3: Gateway 起動 =====
echo "[start] openclaw gateway run --port ${PORT} --bind lan"

exec openclaw gateway run \
    --port "$PORT" \
    --bind lan \
    --allow-unconfigured \
    2>&1 | tee "$LOG_DIR/${AGENT}.log"
