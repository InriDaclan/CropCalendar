import React from 'react';
import { 
  CloudSun, 
  Thermometer, 
  Droplet, 
  CalendarDays, 
  ShieldCheck, 
  Sparkles, 
  Database 
} from 'lucide-react';

export default function WeatherWidget({ 
  weather, 
  onSelectRecommendedCrop 
}) {
  if (!weather) return null;

  return (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
      border: '1px solid #bbf7d0',
      borderRadius: '16px',
      padding: '1.2rem 1.5rem',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
        {/* Left: Weather & Season Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: '#dcfce7',
            color: '#15803d',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CloudSun size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.95rem', fontWeight: '800', color: '#14532d' }}>
                {weather.season} Season ({weather.current_month})
              </span>
              <span style={{ fontSize: '0.75rem', background: '#ffffff', color: '#15803d', border: '1px solid #86efac', padding: '0.1rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>
                {weather.temperature}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: '#475569', marginTop: '0.1rem' }}>
              🌱 Soil Temp: <b>{weather.soil_temperature}</b> • Sunlight: <b>{weather.sunlight_hours}</b> • Frost Risk: <b>{weather.frost_risk}</b>
            </div>
          </div>
        </div>

        {/* Right: Auto-Approved Status & DB Engine */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            background: '#ecfdf5', 
            border: '1px solid #a7f3d0', 
            padding: '0.3rem 0.65rem', 
            borderRadius: '999px', 
            fontSize: '0.75rem', 
            fontWeight: '700', 
            color: '#065f46' 
          }} title="All actions and permissions are automatically approved">
            <ShieldCheck size={14} color="#059669" />
            <span>Permissions: Auto-Approved</span>
          </div>

          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            background: '#f8fafc', 
            border: '1px solid #e2e8f0', 
            padding: '0.3rem 0.65rem', 
            borderRadius: '999px', 
            fontSize: '0.75rem', 
            fontWeight: '600', 
            color: '#334155' 
          }} title="Configured via .env database URL">
            <Database size={13} color="#64748b" />
            <span>DB: {weather.database_engine?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Seasonal Advisory & Quick-Select Recommendations */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        borderTop: '1px dashed #bbf7d0', 
        paddingTop: '0.75rem', 
        flexWrap: 'wrap', 
        gap: '0.75rem' 
      }}>
        <div style={{ fontSize: '0.85rem', color: '#166534', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Sparkles size={15} color="#16a34a" />
          <span><b>Sowing Advisory:</b> {weather.advisory}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
            Recommended:
          </span>
          {weather.recommended_crops?.map((cropName) => (
            <button
              key={cropName}
              onClick={() => onSelectRecommendedCrop(cropName)}
              style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                background: '#ffffff',
                border: '1px solid #86efac',
                color: '#15803d',
                padding: '0.2rem 0.55rem',
                borderRadius: '6px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#dcfce7'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
            >
              + {cropName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
