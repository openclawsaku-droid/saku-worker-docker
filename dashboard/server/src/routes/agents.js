const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const AGENT_CONTAINERS = ['pu-chan', 'pino'];

// GET /api/agents - エージェント一覧とステータス
router.get('/', async (req, res) => {
  try {
    const results = await Promise.all(AGENT_CONTAINERS.map(async (name) => {
      try {
        const container = docker.getContainer(name);
        const info = await container.inspect();
        return {
          name,
          status: info.State.Status,
          running: info.State.Running,
          startedAt: info.State.StartedAt,
          image: info.Config.Image,
          ports: info.NetworkSettings.Ports,
        };
      } catch (e) {
        return { name, status: 'not found', running: false };
      }
    }));
    res.json(results);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/agents/:name/start
router.post('/:name/start', async (req, res) => {
  const { name } = req.params;
  if (!AGENT_CONTAINERS.includes(name)) return res.status(400).json({ error: 'Unknown agent' });
  try {
    const container = docker.getContainer(name);
    await container.start();
    res.json({ ok: true, action: 'start', name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/agents/:name/stop
router.post('/:name/stop', async (req, res) => {
  const { name } = req.params;
  if (!AGENT_CONTAINERS.includes(name)) return res.status(400).json({ error: 'Unknown agent' });
  try {
    const container = docker.getContainer(name);
    await container.stop();
    res.json({ ok: true, action: 'stop', name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/agents/:name/restart
router.post('/:name/restart', async (req, res) => {
  const { name } = req.params;
  if (!AGENT_CONTAINERS.includes(name)) return res.status(400).json({ error: 'Unknown agent' });
  try {
    const container = docker.getContainer(name);
    await container.restart();
    res.json({ ok: true, action: 'restart', name });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
