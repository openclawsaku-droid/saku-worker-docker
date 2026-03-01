const express = require('express');
const cors = require('cors');

const agentsRouter = require('./routes/agents');
const logsRouter = require('./routes/logs');
const routerRouter = require('./routes/router');
const configRouter = require('./routes/config');

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/agents', agentsRouter);
app.use('/api/logs', logsRouter);
app.use('/api/router', routerRouter);
app.use('/api/config', configRouter);

// Health check
app.get('/health', (req, res) => res.json({ ok: true, ts: Date.now() }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Dashboard API running on :${PORT}`);
});
