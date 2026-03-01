const express = require('express');
const router = express.Router();

const ROUTER_URL = process.env.ROUTER_INTERNAL_URL || 'http://router:8080';

// GET /api/router/health
router.get('/health', async (req, res) => {
  try {
    const resp = await fetch(`${ROUTER_URL}/health`);
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(503).json({ error: 'router unreachable', detail: e.message });
  }
});

// GET /api/router/models
router.get('/models', async (req, res) => {
  try {
    const resp = await fetch(`${ROUTER_URL}/v1/models`);
    const data = await resp.json();
    res.json(data);
  } catch (e) {
    res.status(503).json({ error: e.message });
  }
});

module.exports = router;
