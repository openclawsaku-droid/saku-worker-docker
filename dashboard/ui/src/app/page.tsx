const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';

async function getAgents() {
  try {
    const res = await fetch(`${API}/api/agents`, { cache: 'no-store' });
    return res.json();
  } catch { return []; }
}

export default async function Home() {
  const agents = await getAgents();

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Agent Status</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {agents.map((agent: any) => (
          <div key={agent.name} style={{
            background: '#1a1a1a',
            border: `1px solid ${agent.running ? '#22c55e' : '#ef4444'}`,
            borderRadius: 8,
            padding: 20
          }}>
            <h2 style={{ margin: '0 0 8px', fontSize: 18 }}>{agent.name}</h2>
            <p style={{ margin: '4px 0', color: agent.running ? '#22c55e' : '#ef4444' }}>
              {agent.running ? '● Running' : '○ Stopped'}
            </p>
            <p style={{ margin: '4px 0', fontSize: 12, color: '#666' }}>{agent.status}</p>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <form action={`${API}/api/agents/${agent.name}/restart`} method="post">
                <button type="submit" style={{ padding: '6px 14px', background: '#374151', border: 'none', borderRadius: 4, color: '#f0f0f0', cursor: 'pointer' }}>
                  Restart
                </button>
              </form>
              <form action={`${API}/api/agents/${agent.name}/${agent.running ? 'stop' : 'start'}`} method="post">
                <button type="submit" style={{ padding: '6px 14px', background: agent.running ? '#7f1d1d' : '#14532d', border: 'none', borderRadius: 4, color: '#f0f0f0', cursor: 'pointer' }}>
                  {agent.running ? 'Stop' : 'Start'}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
