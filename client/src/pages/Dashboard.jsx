import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const statusBadge = {
  TODO: { color: '#D97706', bg: '#FFFBEB', label: 'To Do' },
  IN_PROGRESS: { color: '#2563EB', bg: '#EFF6FF', label: 'In Progress' },
  DONE: { color: '#059669', bg: '#ECFDF5', label: 'Done' },
};

const PIE_COLORS = ['#FCD34D', '#93C5FD', '#6EE7B7', '#FCA5A5'];

const statConfig = [
  { key: 'total', label: 'Total Tasks', icon: '📋', color: '#6366F1', bg: '#EEF2FF' },
  { key: 'todo', label: 'To Do', icon: '⏳', color: '#D97706', bg: '#FFFBEB' },
  { key: 'inProgress', label: 'In Progress', icon: '🔄', color: '#2563EB', bg: '#EFF6FF' },
  { key: 'done', label: 'Done', icon: '✅', color: '#059669', bg: '#ECFDF5' },
  { key: 'overdue', label: 'Overdue', icon: '⚠️', color: '#DC2626', bg: '#FEF2F2' },
];

const card = { background: '#fff', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', overflow: 'hidden' };
const hdr = { padding: '18px 22px', borderBottom: '1px solid var(--border)' };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([api.get('/dashboard'), api.get('/projects')])
      .then(([d, p]) => { setData(d.data); setProjects(p.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid var(--accent-light)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Loading dashboard...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const taskStatusData = [
    { name: 'To Do', value: data?.todo || 0 },
    { name: 'In Progress', value: data?.inProgress || 0 },
    { name: 'Done', value: data?.done || 0 },
    { name: 'Overdue', value: data?.overdue || 0 },
  ];

  const priorityData = [
    { name: 'Low', value: 0, fill: '#6EE7B7' },
    { name: 'Medium', value: 0, fill: '#FCD34D' },
    { name: 'High', value: 0, fill: '#FCA5A5' },
  ];
  data?.recentTasks?.forEach((t) => {
    if (t.priority === 'LOW') priorityData[0].value++;
    if (t.priority === 'MEDIUM') priorityData[1].value++;
    if (t.priority === 'HIGH') priorityData[2].value++;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: 0, fontFamily: 'Plus Jakarta Sans' }}>Dashboard</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: '2px 0 0' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative' }}>
              <input placeholder="Search anything" style={{ padding: '9px 14px 9px 36px', background: '#fff', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13, color: 'var(--text-primary)', outline: 'none', width: 200 }} />
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            </div>
            <div style={{ width: 38, height: 38, background: '#fff', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-secondary)" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 14, marginBottom: 20 }}>
          {statConfig.map((s) => (
            <div key={s.key} style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', padding: '18px 20px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</span>
                <div style={{ width: 32, height: 32, background: s.bg, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{s.icon}</div>
              </div>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 32, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{data?.[s.key] || 0}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={card}>
            <div style={hdr}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Task Status Distribution</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>Overview of all task statuses</p>
            </div>
            <div style={{ padding: '16px 22px' }}>
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie data={taskStatusData} cx="50%" cy="50%" outerRadius={80} innerRadius={40} dataKey="value" paddingAngle={3}>
                    {taskStatusData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} stroke="none" />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, fontFamily: 'DM Sans' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                {taskStatusData.map((d, i) => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i] }} />
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={card}>
            <div style={hdr}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Tasks by Priority</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>Priority distribution of recent tasks</p>
            </div>
            <div style={{ padding: '16px 8px 16px 4px' }}>
              <ResponsiveContainer width="100%" height={230}>
                <BarChart data={priorityData} barSize={40} margin={{ top: 8, right: 16, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 6" stroke="#F3F4F6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fontFamily: 'DM Sans', fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fontFamily: 'DM Sans', fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12, fontFamily: 'DM Sans' }} />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Project Progress */}
        <div style={{ ...card, marginBottom: 16 }}>
          <div style={{ ...hdr, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Project Progress</h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>{projects.length} projects total</p>
            </div>
          </div>
          {projects.length === 0 && <div style={{ padding: '40px', textAlign: 'center' }}><p style={{ color: 'var(--text-muted)' }}>No projects yet.</p></div>}
          <div style={{ padding: '8px 0' }}>
            {projects.map((project, i) => {
              const total = project.tasks?.length || 0;
              const done = project.tasks?.filter((t) => t.status === 'DONE').length || 0;
              const inProg = project.tasks?.filter((t) => t.status === 'IN_PROGRESS').length || 0;
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)}
                  style={{ padding: '14px 22px', cursor: 'pointer', borderBottom: i < projects.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px', fontFamily: 'Plus Jakarta Sans' }}>{project.name}</p>
                      <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{project.members?.length} members · {total} tasks · {inProg} in progress</p>
                    </div>
                    <span style={{ fontSize: 22, fontWeight: 800, color: pct === 100 ? 'var(--success)' : 'var(--accent)', fontFamily: 'Plus Jakarta Sans' }}>{pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--bg)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: pct === 100 ? '#6EE7B7' : 'linear-gradient(90deg, #6366F1, #818CF8)', borderRadius: 999, transition: 'width 0.5s ease' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Tasks */}
        <div style={card}>
          <div style={hdr}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Recent Tasks</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '2px 0 0' }}>Latest activity across all projects</p>
          </div>
          {(!data?.recentTasks || data.recentTasks.length === 0) && <div style={{ padding: '40px', textAlign: 'center' }}><p style={{ color: 'var(--text-muted)' }}>No tasks yet.</p></div>}
          <div style={{ padding: '8px 0' }}>
            {data?.recentTasks?.map((task, i) => {
              const s = statusBadge[task.status] || statusBadge.TODO;
              return (
                <div key={task.id} onClick={() => navigate(`/projects/${task.projectId}`)}
                  style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: i < data.recentTasks.length - 1 ? '1px solid var(--border)' : 'none', cursor: 'pointer', transition: 'background 0.15s' }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', margin: '0 0 2px' }}>{task.title}</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>{task.project?.name}{task.assignee ? ` · ${task.assignee.name}` : ''}</p>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '4px 12px', background: s.bg, color: s.color, borderRadius: 20, whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
