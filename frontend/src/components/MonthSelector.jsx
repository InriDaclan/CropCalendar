import React from 'react';
import { Calendar, Sun, CloudRain, Snowflake, Flower2 } from 'lucide-react';

const MONTHS = [
  { name: 'Jan', season: 'Winter', full: 'January', icon: '❄️' },
  { name: 'Feb', season: 'Winter', full: 'February', icon: '❄️' },
  { name: 'Mar', season: 'Spring', full: 'March', icon: '🌸' },
  { name: 'Apr', season: 'Spring', full: 'April', icon: '🌱' },
  { name: 'May', season: 'Spring', full: 'May', icon: '🌿' },
  { name: 'Jun', season: 'Summer', full: 'June', icon: '☀️' },
  { name: 'Jul', season: 'Summer', full: 'July', icon: '🍉' },
  { name: 'Aug', season: 'Summer', full: 'August', icon: '🌻' },
  { name: 'Sep', season: 'Autumn', full: 'September', icon: '🍂' },
  { name: 'Oct', season: 'Autumn', full: 'October', icon: '🎃' },
  { name: 'Nov', season: 'Autumn', full: 'November', icon: '🍠' },
  { name: 'Dec', season: 'Winter', full: 'December', icon: '❄️' },
];

export default function MonthSelector({ 
  selectedMonth, 
  onSelectMonth 
}) {
  const currentMonthIdx = new Date().getMonth(); // 0-indexed

  return (
    <div style={{
      background: 'white',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      padding: '0.85rem 1.25rem',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: '800', color: '#15803d' }}>
          <Calendar size={16} />
          <span>Interactive Planting Calendar (Select Month)</span>
        </div>
        {selectedMonth && (
          <button
            onClick={() => onSelectMonth(null)}
            style={{
              background: 'none',
              border: 'none',
              color: '#64748b',
              fontSize: '0.78rem',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear Month Filter
          </button>
        )}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '0.4rem',
        overflowX: 'auto'
      }}>
        {MONTHS.map((m, idx) => {
          const isCurrent = idx === currentMonthIdx;
          const isSelected = selectedMonth === m.full;

          return (
            <button
              key={m.name}
              onClick={() => onSelectMonth(isSelected ? null : m.full)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem 0.25rem',
                borderRadius: '10px',
                border: isSelected ? '2px solid #16a34a' : isCurrent ? '1px solid #86efac' : '1px solid #f1f5f9',
                background: isSelected ? '#dcfce7' : isCurrent ? '#f0fdf4' : '#f8fafc',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative'
              }}
              title={`${m.full} (${m.season} Planting)`}
            >
              <span style={{ fontSize: '0.9rem' }}>{m.icon}</span>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: isSelected || isCurrent ? '800' : '600',
                color: isSelected ? '#15803d' : isCurrent ? '#16a34a' : '#475569',
                marginTop: '0.2rem'
              }}>
                {m.name}
              </span>
              {isCurrent && (
                <span style={{
                  fontSize: '0.55rem',
                  fontWeight: '700',
                  color: '#15803d',
                  textTransform: 'uppercase'
                }}>
                  NOW
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
