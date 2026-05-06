import { useState, useEffect, useCallback, useRef } from 'react';

const styles = {
  root: {
    minHeight: '100vh',
    background: '#f5f5f0',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '2rem 1rem',
    fontFamily: "'Sarabun', 'Segoe UI', sans-serif",
  },
  container: {
    width: '100%',
    maxWidth: '680px',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '1.5rem',
  },
  headerIcon: {
    width: '44px',
    height: '30px',
    borderRadius: '12px',
    background: '#dbeafe',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    flexShrink: 0,
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1a1a1a',
    margin: 0,
  },
  headerSub: {
    fontSize: '13px',
    color: '#888',
    margin: 0,
    marginTop: '2px',
  },
  liveBadge: {
    marginLeft: 'auto',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    color: '#666',
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '99px',
    padding: '4px 10px',
  },
  liveDot: {
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: '#22c55e',
    animation: 'pulse 2s infinite',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '1.1rem',
  },
  statCard: {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '14px',
    padding: '1rem 1.1rem',
  },
  statLabel: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
  },
  statValue: {
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: 1,
    color: '#1a1a1a',
  },
  statBar: {
    marginTop: '10px',
    height: '4px',
    borderRadius: '99px',
    background: '#f0f0f0',
    overflow: 'hidden',
  },
  scanCard: {
    background: '#fff',
    border: '1px solid #e5e5e5',
    borderRadius: '16px',
    padding: '1.25rem',
  },
  scanTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1a1a1a',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px',
  },
  scanDesc: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '14px',
  },
  scanRow: {
    display: 'flex',
    gap: '8px',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '14px',
    border: '1px solid #e0e0e0',
    borderRadius: '10px',
    outline: 'none',
    background: '#fafafa',
    color: '#1a1a1a',
    transition: 'border-color 0.2s',
  },
  button: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    border: 'none',
    borderRadius: '10px',
    background: '#1a1a1a',
    color: '#fff',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'background 0.2s',
    whiteSpace: 'nowrap',
  },
};

const STATUS_CONFIG = {
  idle: {
    avatarBg: '#f3f4f6',
    badgeBg: '#f3f4f6',
    badgeColor: '#9ca3af',
    cardBorder: '#e5e5e5',
    icon: '👤',
    label: '',
  },
  checkin: {
    avatarBg: '#dcfce7',
    badgeBg: '#dcfce7',
    badgeColor: '#16a34a',
    cardBorder: '#86efac',
    icon: '✅',
    label: 'เข้างาน',
  },
  duplicate: {
    avatarBg: '#fffbeb',    
    badgeBg: '#fffbeb',    
    badgeColor: '#b45309',  
    cardBorder: '#fcd34d',  
    icon: '⚠️',            
    label: 'ลงชื่อไปแล้ว',
},
error: {
    avatarBg: '#fef2f2',   
    badgeBg: '#fef2f2',     
    badgeColor: '#dc2626', 
    cardBorder: '#fca5a5', 
    icon: '❌',            
    label: 'ไม่พบข้อมูลในระบบ',
  }
};

const TOAST_CONFIG = {
  success: {
    bg: '#f0fdf4',
    color: '#16a34a',
    border: '#86efac',
    icon: '✅',
    fontSize: '13px',
    padding: '6px 18px',
    iconSize: '16px',
  },
  error: {
    bg: '#fef2f2',
    color: '#dc2626',
    border: '#fca5a5',
    icon: '❌',
    fontSize: '16px',
    padding: '10px 26px',
    iconSize: '20px',
  },
  duplicate: {
    bg: '#fffbeb',
    color: '#b45309',
    border: '#fcd34d',
    icon: '⚠️',
    fontSize: '13px',       
    padding: '6px 18px',
    iconSize: '16px',
},
error: {
    bg: '#fef2f2',
    color: '#dc2626',
    border: '#fca5a5',
    icon: '❌',
    fontSize: '13px',
    padding: '6px 18px',
    iconSize: '16px',
  },
};

function HeroCard({ name, status, scanTime, toast }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.idle;
  const isIdle = status === 'idle';
  const tc = TOAST_CONFIG[toast.type] || TOAST_CONFIG.success;

  return (
    <div
      style={{
        background: '#fff',
        border: `2px solid ${cfg.cardBorder}`,
        borderRadius: '20px',
        padding: '2.2rem 2rem',
        marginBottom: '1.1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: '12px',
        transition: 'border-color 0.4s',
        position: 'relative',
      }}
    >
      {/* Inline Toast */}
      {toast.message && (
        <div
          style={{
            position: 'absolute',
            top: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: tc.bg,
            color: tc.color,
            border: `1px solid ${tc.border}`,
            borderRadius: '99px',
            padding: tc.padding,
            fontSize: tc.fontSize,
            fontWeight: '700',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1,
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
          }}
        >
          <span style={{ fontSize: tc.iconSize }}>{tc.icon}</span>
          {toast.message}
        </div>
      )}

      {/* Avatar */}
      <div
        style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: cfg.avatarBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '44px',
          marginTop: toast.message ? '36px' : '0',
          transition: 'background 0.4s, margin-top 0.3s',
        }}
      >
        {cfg.icon}
      </div>

      <div style={{ fontSize: '13px', color: '#aaa' }}>พนักงานที่สแกนล่าสุด</div>

      <div
        style={{
          fontSize: isIdle ? '24px' : '36px',
          fontWeight: '700',
          color: isIdle ? '#ccc' : '#1a1a1a',
          lineHeight: 1.2,
          transition: 'font-size 0.3s',
        }}
      >
        {isIdle ? 'รอการสแกน...' : name}
      </div>

      {!isIdle && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '16px',
            fontWeight: '600',
            padding: '8px 22px',
            borderRadius: '99px',
            background: cfg.badgeBg,
            color: cfg.badgeColor,
            transition: 'background 0.4s, color 0.4s',
          }}
        >
          {cfg.label}
        </div>
      )}

      {!isIdle && (
        <div style={{ fontSize: '13px', color: '#7213758e' }}>เวลาสแกน {scanTime}</div>
      )}
    </div>
  );
}

function StatCard({ label, value, total, color, icon }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const barColor = { total: '#94a3b8', checked: '#22c55e', missing: '#ef4444' }[color];
  const valueColor = { total: '#1a1a1a', checked: '#16a34a', missing: '#dc2626' }[color];

  return (
    <div style={styles.statCard}>
      <div style={styles.statLabel}>
        <span>{icon}</span>
        {label}
      </div>
      <div style={{ ...styles.statValue, color: valueColor }}>{value}</div>
      <div style={styles.statBar}>
        <div
          style={{
            height: '100%',
            borderRadius: '99px',
            background: barColor,
            width: `${pct}%`,
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

function App() {
  const [stats, setStats] = useState({ total: 0, checkedIn: 0, missing: 0 });
  const [latestPerson, setLatestPerson] = useState('');
  const [scanStatus, setScanStatus] = useState('idle');
  const [scanTime, setScanTime] = useState('');
  const [rfidInput, setRfidInput] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const toastTimerRef = useRef(null);

  const showToast = (message, type = 'success') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast({ message, type });
    const duration = type === 'success' ? 3000 : 4000;
    toastTimerRef.current = setTimeout(() => {
      setToast({ message: '', type: '' });
      toastTimerRef.current = null;
    }, duration);
  };

  const fetchDashboardStats = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/dashboard');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    const interval = setInterval(fetchDashboardStats, 5000);
    return () => clearInterval(interval);
  }, [fetchDashboardStats]);

  const getNowTime = () =>
    new Date().toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const handleScan = async () => {
    const rfid = rfidInput.trim();
    if (!rfid) return;

    try {
      const response = await fetch('http://localhost:3001/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfid }),
      });
      const data = await response.json();

      if (data.success) {
        setLatestPerson(data.latestPerson);
        setScanStatus('checkin'); 
        setScanTime(getNowTime());
        fetchDashboardStats();
        showToast('ลงชื่อสำเร็จ', 'success');

      } else if (data.type === 'duplicate') {
        setLatestPerson(data.latestPerson);
        setScanStatus('duplicate'); 
        setScanTime(getNowTime());
        showToast(data.message || 'คุณลงชื่อไปแล้ว', 'duplicate'); 

      } else {
        setLatestPerson('Unknown ID');
        setScanStatus('error');       
        setScanTime(getNowTime());
        showToast(data.message || 'ไม่พบข้อมูลนี้ในระบบ', 'error');
      }
    } catch (error) {
      setScanStatus('error');
      showToast('เชื่อมต่อเซิร์ฟเวอร์ไม่ได้', 'error');
    }
    setRfidInput('');
};

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleScan();
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f5f0; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>

      <div style={styles.root}>
        <div style={styles.container}>

          {/* Header */}
          <div style={styles.header}>
            <div style={styles.headerIcon}>🪪</div>
            <div>
              <p style={styles.headerTitle}>ระบบเช็คชื่อพนักงาน</p>
              <p style={styles.headerSub}>RFID Attendance System</p>
            </div>
            <div style={styles.liveBadge}>
              <span style={styles.liveDot} />
              Live
            </div>
          </div>

          {/* Hero Card */}
          <HeroCard
            name={latestPerson}
            status={scanStatus}
            scanTime={scanTime}
            toast={toast}
          />

          {/* Stats */}
          <div style={styles.statsGrid}>
            <StatCard label="พนักงานทั้งหมด" value={stats.total} total={stats.total} color="total" icon="👥" />
            <StatCard label="ลงชื่อแล้ว" value={stats.checkedIn} total={stats.total} color="checked" icon="✅" />
            <StatCard label="ยังไม่ลงชื่อ" value={stats.missing} total={stats.total} color="missing" icon="⏳" />
          </div>

          {/* Scan Input */}
          <div style={styles.scanCard}>
            <div style={styles.scanTitle}>
              <span></span> จำลองการสแกนบัตร
            </div>
            <p style={styles.scanDesc}>
              เครื่องสแกน RFID จริงจะส่งรหัสเข้ามาโดยอัตโนมัติ หรือพิมพ์รหัสเพื่อทดสอบ
            </p>
            <div style={styles.scanRow}>
              <input
                type="text"
                value={rfidInput}
                onChange={(e) => setRfidInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
                placeholder="แตะบัตร RFID หรือพิมพ์รหัส..."
                autoFocus
                style={{
                  ...styles.input,
                  borderColor: inputFocused ? '#1a1a1a' : '#e0e0e0',
                  boxShadow: inputFocused ? '0 0 0 3px rgba(0,0,0,0.06)' : 'none',
                }}
              />
              <button
                onClick={handleScan}
                style={styles.button}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#333')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1a1a1a')}
              >
                สแกน
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

export default App;