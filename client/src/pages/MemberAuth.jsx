import { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

const statusConfig = {
  PENDING: { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', label: 'Pending' },
  APPROVED: { color: '#059669', bg: '#ECFDF5', border: '#A7F3D0', label: 'Approved' },
  DENIED: { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA', label: 'Denied' },
};

function UserTable({ users, loading, filter, setFilter, onAction, actionLoading, type }) {
  const filtered = users.filter((u) => u.status === filter);
  const counts = {
    PENDING: users.filter((u) => u.status === 'PENDING').length,
    APPROVED: users.filter((u) => u.status === 'APPROVED').length,
    DENIED: users.filter((u) => u.status === 'DENIED').length,
  };

  return (
    <div>
      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 22 }}>
        {[
          { key: 'PENDING', label: 'Awaiting Review', emoji: '⏳' },
          { key: 'APPROVED', label: 'Approved', emoji: '✅' },
          { key: 'DENIED', label: 'Denied', emoji: '❌' },
        ].map((s) => {
          const sc = statusConfig[s.key];
          const isActive = filter === s.key;
          return (
            <div key={s.key} onClick={() => setFilter(s.key)} style={{ background: isActive ? sc.bg : '#fff', border: `1.5px solid ${isActive ? sc.border : 'var(--border)'}`, borderRadius: 14, padding: '18px 22px', cursor: 'pointer', transition: 'all 0.15s', boxShadow: isActive ? '0 4px 12px rgba(0,0,0,0.06)' : '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontSize: 20 }}>{s.emoji}</span>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: isActive ? sc.color : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontFamily: 'Plus Jakarta Sans' }}>{s.label}</p>
              </div>
              <p style={{ margin: 0, fontSize: 36, fontWeight: 800, fontFamily: 'Plus Jakarta Sans', color: isActive ? sc.color : 'var(--text-primary)', lineHeight: 1 }}>{counts[s.key]}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '16px 22px', borderBottom: '1px solid var(--border)' }}>
          <h3 style={{ margin: 0, fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
            {statusConfig[filter].label} {type}s
            <span style={{ marginLeft: 8, fontSize: 13, fontWeight: 500, color: 'var(--text-muted)' }}>({filtered.length})</span>
          </h3>
        </div>

        {loading && (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--accent-light)', borderTop: '3px solid var(--accent)', borderRadius: '50%', margin: '0 auto 12px', animation: 'spin 0.8s linear infinite' }} />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: '56px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 6px' }}>No {statusConfig[filter].label.toLowerCase()} {type.toLowerCase()}s</p>
            <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
              {filter === 'PENDING' ? 'All requests have been reviewed.' : `No ${type.toLowerCase()}s have been ${filter.toLowerCase()} yet.`}
            </p>
          </div>
        )}

        {!loading && filtered.map((u, i) => {
          const s = statusConfig[u.status];
          return (
            <div key={u.id} style={{ padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 14, borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#F9FAFB'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: type === 'Admin' ? '#EFF6FF' : 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: type === 'Admin' ? '#2563EB' : 'var(--accent)', flexShrink: 0 }}>{u.name[0].toUpperCase()}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Plus Jakarta Sans' }}>{u.name}</p>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: type === 'Admin' ? '#EFF6FF' : 'var(--accent-light)', color: type === 'Admin' ? '#2563EB' : 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{type}</span>
                </div>
                <p style={{ margin: '0 0 2px', fontSize: 13, color: 'var(--text-secondary)' }}>{u.email}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)' }}>Requested {new Date(u.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: s.bg, color: s.color, border: `1px solid ${s.border}`, whiteSpace: 'nowrap' }}>{s.label}</span>
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {u.status !== 'APPROVED' && (
                  <button onClick={() => onAction(u.id, 'APPROVED')} disabled={actionLoading === u.id + 'APPROVED'} style={{ padding: '7px 16px', borderRadius: 8, background: '#ECFDF5', border: '1.5px solid #A7F3D0', color: '#059669', fontSize: 12, fontWeight: 700, fontFamily: 'Plus Jakarta Sans', cursor: 'pointer', opacity: actionLoading === u.id + 'APPROVED' ? 0.6 : 1 }}>Approve</button>
                )}
                {u.status !== 'DENIED' && (
                  <button onClick={() => onAction(u.id, 'DENIED')} disabled={actionLoading === u.id + 'DENIED'} style={{ padding: '7px 16px', borderRadius: 8, background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626', fontSize: 12, fontWeight: 700, fontFamily: 'Plus Jakarta Sans', cursor: 'pointer', opacity: actionLoading === u.id + 'DENIED' ? 0.6 : 1 }}>Deny</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function MemberAuth() {
  const [members, setMembers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('members');
  const [memberFilter, setMemberFilter] = useState('PENDING');
  const [adminFilter, setAdminFilter] = useState('PENDING');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchAll = () => {
    setLoading(true);
    Promise.all([api.get('/admin/members'), api.get('/admin/admins')]).then(([m, a]) => {
      setMembers(m.data); setAdmins(a.data); setLoading(false);
    });
  };
  useEffect(() => { fetchAll(); }, []);

  const handleAction = async (userId, status) => {
    setActionLoading(userId + status);
    try { await api.patch(`/admin/users/${userId}/status`, { status }); fetchAll(); }
    finally { setActionLoading(null); }
  };

  const pendingMembers = members.filter((m) => m.status === 'PENDING').length;
  const pendingAdmins = admins.filter((a) => a.status === 'PENDING').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '28px 32px', overflowY: 'auto' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px', fontFamily: 'Plus Jakarta Sans' }}>Account Approvals</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>Review and manage member and admin account requests</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 22, background: '#fff', padding: 4, borderRadius: 12, width: 'fit-content', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {[
            { key: 'members', label: 'Members', pending: pendingMembers },
            { key: 'admins', label: 'Admins', pending: pendingAdmins },
          ].map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '8px 20px', borderRadius: 9, border: 'none', background: activeTab === tab.key ? 'var(--accent)' : 'transparent', color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)', fontSize: 13, fontWeight: 600, fontFamily: 'Plus Jakarta Sans', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s' }}>
              {tab.label}
              {tab.pending > 0 && (
                <span style={{ background: activeTab === tab.key ? 'rgba(255,255,255,0.25)' : '#FFFBEB', color: activeTab === tab.key ? '#fff' : '#D97706', fontSize: 11, fontWeight: 700, padding: '1px 7px', borderRadius: 20, minWidth: 20, textAlign: 'center' }}>{tab.pending}</span>
              )}
            </button>
          ))}
        </div>

        {activeTab === 'members' && <UserTable users={members} loading={loading} filter={memberFilter} setFilter={setMemberFilter} onAction={handleAction} actionLoading={actionLoading} type="Member" />}
        {activeTab === 'admins' && <UserTable users={admins} loading={loading} filter={adminFilter} setFilter={setAdminFilter} onAction={handleAction} actionLoading={actionLoading} type="Admin" />}
      </main>
    </div>
  );
}
