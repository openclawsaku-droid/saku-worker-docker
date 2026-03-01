const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const SHARED_DIR = process.env.SHARED_DIR || '/shared';

// GET /api/config/env - .env の変数名一覧（値は返さない）
router.get('/env', (req, res) => {
  try {
    const envPath = path.join(SHARED_DIR, '../.env');
    if (!fs.existsSync(envPath)) return res.json({ keys: [] });
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    const keys = lines
      .filter(l => l.trim() && !l.startsWith('#') && l.includes('='))
      .map(l => l.split('=')[0].trim());
    res.json({ keys });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
