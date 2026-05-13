import React, { useState, useEffect } from 'react';
import { useTheme } from '../App';
import { 
  ShieldAlert, Zap, 
  Activity, Terminal, CheckCircle2, X
} from 'lucide-react';

export default function Alerts({ proactive }) {
  const { t, mode } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDraft, setCurrentDraft] = useState("");

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const clean = (text) => {
    if (!text) return "";

    return text
      .replace(/[#*]/g, '')
      .replace(/Sayın \[.*?\]/g, 'Sayın İş Ortağımız')
      .trim();
  };

  const handleExecute = (actionTitle) => {
    const confirmExec = window.confirm(
      `"${actionTitle}" işlemini başlatmak istediğinize emin misiniz?`
    );

    if (confirmExec) {
      alert("🚀 Aksiyon protokolü başarıyla devreye alındı.");
    }
  };

  // ====== SADECE BURASI DÜZELTİLDİ ======
  const openEditModal = (detail) => {
    if (!detail) return;

    const parsedDetail =
      typeof detail === 'string'
        ? detail
        : detail?.data
          ? detail.data
          : JSON.stringify(detail, null, 2);

    setCurrentDraft(parsedDetail);
    setIsModalOpen(true);
  };

  return (
    <div
      className="content-animate"
      style={{
        maxWidth: '1000px',
        margin: '0 auto'
      }}
    >

      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '40px'
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: t.danger,
              marginBottom: '8px'
            }}
          >
            <ShieldAlert size={16} />

            <span
              style={{
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '1.5px',
                textTransform: 'uppercase'
              }}
            >
              Rapid Response Unit
            </span>
          </div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: 800,
              color: t.accent,
              letterSpacing: '-1.5px'
            }}
          >
            Otonom Müdahale Merkezi
          </h1>
        </div>

        <div
          style={{
            background: t.card,
            padding: '12px 24px',
            borderRadius: '16px',
            border: `1px solid ${t.border}`,
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '24px',
              fontWeight: 800,
              color: t.danger,
              lineHeight: 1
            }}
          >
            {proactive?.anomaly_count || 0}
          </div>

          <div
            style={{
              fontSize: '10px',
              fontWeight: 800,
              color: t.textMuted,
              textTransform: 'uppercase',
              marginTop: '4px'
            }}
          >
            Aktif Risk
          </div>
        </div>
      </header>

      {/* ACTION LIST */}
      <div
        style={{
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <Activity size={16} color={t.textMuted} />

        <span
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: t.textMuted,
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}
        >
          Bekleyen Protokoller
        </span>
      </div>

      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}
      >
        {proactive?.actions?.length > 0 ? (
          proactive.actions.map((action, i) => (
            <article
              key={i}
              style={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: '24px',
                padding: '24px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontSize: '17px',
                    fontWeight: 700,
                    color: t.text,
                    marginBottom: '10px'
                  }}
                >
                  {clean(action.anomaly)}
                </h3>

                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: t.accentSoft,
                    color: t.accentSecondary,
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700
                  }}
                >
                  <Zap size={14} fill="currentColor" />
                  {clean(action.action)}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '12px'
                }}
              >
                <button
                  onClick={() => openEditModal(action.detail)}
                  style={{
                    padding: '10px 18px',
                    background: t.surface,
                    color: t.text,
                    border: `1px solid ${t.border}`,
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Detayları Gör
                </button>

                <button
                  onClick={() => handleExecute(action.action)}
                  style={{
                    padding: '10px 22px',
                    background: t.accent,
                    color: mode === 'dark' ? '#000' : '#FFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Uygula
                </button>
              </div>
            </article>
          ))
        ) : (
          <div
            style={{
              padding: '80px',
              textAlign: 'center',
              background: t.card,
              border: `1px dashed ${t.border}`,
              borderRadius: '24px'
            }}
          >
            <CheckCircle2
              size={48}
              color={t.success}
              style={{
                marginBottom: '16px',
                opacity: 0.5
              }}
            />

            <div
              style={{
                color: t.textMuted,
                fontSize: '16px',
                fontWeight: 500
              }}
            >
              Sistem durumu stabil. Müdahale gerekmiyor.
            </div>
          </div>
        )}
      </section>

      {/* MODAL */}
      {isModalOpen && (
        <>
          <div
            onClick={() => setIsModalOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.08)',
              zIndex: 9999
            }}
          />

          <div
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: t.card,
              width: '90%',
              maxWidth: '620px',
              maxHeight: '80vh',
              borderRadius: '24px',
              border: `1px solid ${t.border}`,
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
              zIndex: 10000,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >

            {/* MODAL HEADER */}
            <div
              style={{
                padding: '18px 24px',
                borderBottom: `1px solid ${t.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: t.surface
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <Terminal
                  size={18}
                  color={t.accentSecondary}
                />

                <h3
                  style={{
                    margin: 0,
                    color: t.text,
                    fontSize: '16px',
                    fontWeight: 700
                  }}
                >
                  Protokol Taslağı
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: t.textMuted,
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto'
              }}
            >
              <textarea
                value={currentDraft}
                onChange={(e) => setCurrentDraft(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '260px',
                  background:
                    mode === 'dark'
                      ? 'rgba(0,0,0,0.2)'
                      : '#f8f8f8',
                  color: t.text,
                  border: `1px solid ${t.border}`,
                  borderRadius: '16px',
                  padding: '16px',
                  fontSize: '14px',
                  lineHeight: '1.7',
                  outline: 'none',
                  resize: 'none',
                  fontFamily: 'inherit'
                }}
              />

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '12px',
                  marginTop: '20px'
                }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    padding: '10px 20px',
                    color: t.textMuted,
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    fontSize: '13px'
                  }}
                >
                  Kapat
                </button>

                <button
                  onClick={() => {
                    alert("Kaydedildi.");
                    setIsModalOpen(false);
                  }}
                  style={{
                    padding: '10px 24px',
                    background: t.accent,
                    color: mode === 'dark' ? '#000' : '#FFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Değişiklikleri Onayla
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}