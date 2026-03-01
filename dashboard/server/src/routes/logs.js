const express = require('express');
const router = express.Router();
const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

const ALLOWED = ['pu-chan', 'pino', 'saku-router', 'saku-dashboard-api'];

// GET /api/logs/:name?tail=100
router.get('/:name', async (req, res) => {
  const { name } = req.params;
  const tail = parseInt(req.query.tail) || 100;
  if (!ALLOWED.includes(name)) return res.status(400).json({ error: 'Unknown container' });
  try {
    const container = docker.getContainer(name);
    const logs = await container.logs({ stdout: true, stderr: true, tail });
    // Dockerログはバイナリフレーム付き、テキスト変換
    const text = logs.toString('utf8').replace(/[\x00-\x08\x0e-\x1f]/g, '');
    res.json({ name, logs: text.split('\n').filter(Boolean) });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
