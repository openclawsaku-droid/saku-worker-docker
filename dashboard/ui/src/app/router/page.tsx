const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

async function getRouterHealth() {
  try {
    const res = await fetch(`${API}/api/router/health`, { cache: 'no-store' });
    return res.json();
  } catch { return { error: 'unreachable' }; }
}

async function getModels() {
  try {
    const res = await fetch(`${API}/api/router/models`, { cache: 'no-store' });
    return res.json();
  } catch { return { data: [] }; }
}

export default async function RouterPage() {
  const [health, models] = await Promise.all([getRouterHealth(), getModels()]);

  return (
    <div>
      <h1>Router Status</h1>
      <div style={{ background: '#1a1a1a', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h2>Health</h2>
        <pre style={{ color: '#86efac' }}>{JSON.stringify(health, null, 2)}</pre>
      </div>
      <div style={{ background: '#1a1a1a', borderRadius: 8, padding: 20 }}>
        <h2>Available Models</h2>
        <pre style={{ color: '#93c5fd', fontSize: 13 }}>{JSON.stringify(models, null, 2)}</pre>
      </div>
    </div>
  );
}
