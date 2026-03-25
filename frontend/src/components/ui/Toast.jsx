const TYPE_STYLES = {
  points: {
    background: 'linear-gradient(135deg, var(--accent-electric), var(--accent-violet))',
    color: '#fff',
  },
  success: {
    background: 'rgba(74,222,128,0.15)',
    color: '#4ade80',
    border: '1px solid rgba(74,222,128,0.3)',
  },
  error: {
    background: 'rgba(248,113,113,0.15)',
    color: '#f87171',
    border: '1px solid rgba(248,113,113,0.3)',
  },
  info: {
    background: 'var(--glass-bg)',
    color: 'var(--text-primary)',
    border: '1px solid var(--glass-border)',
  },
};

export default function ToastContainer({ toasts }) {
  if (!toasts?.length) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast) => {
        const styles = TYPE_STYLES[toast.type] || TYPE_STYLES.info;
        return (
          <div
            key={toast.id}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '0.85rem',
              fontWeight: 600,
              backdropFilter: 'blur(12px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              animation: 'toastIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              ...styles,
            }}
          >
            {toast.message}
          </div>
        );
      })}
    </div>
  );
}
