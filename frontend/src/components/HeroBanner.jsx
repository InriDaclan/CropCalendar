import React from 'react';
import { Sprout } from 'lucide-react';

export default function HeroBanner({ stats }) {
  return (
    <div className="hero-banner">
      <div className="hero-text">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <Sprout size={16} color="#16a34a" />
          <span style={{ fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#16a34a' }}>
            Plan. Grow. Harvest.
          </span>
        </div>
        <h1>Plan Your Garden Around Every Harvest.</h1>
        <p>
          Explore crops by their growing time, learn when they are ready to harvest, and build a planting schedule that works for your garden.
        </p>
      </div>

      <div className="hero-stats">
        <div className="stat-pill">
          <div className="stat-num">{stats?.total_crops || 0}</div>
          <div className="stat-label">Crops Available</div>
        </div>

        <div className="stat-pill">
          <div className="stat-num">{stats?.avg_growth_days || 0}d</div>
          <div className="stat-label">Average Growth</div>
        </div>

        <div className="stat-pill">
          <div className="stat-num" style={{ color: '#16a34a' }}>
            {stats?.fastest_crop?.growth_days || 0}d
          </div>
          <div className="stat-label">
            Fastest Harvest ({stats?.fastest_crop?.name?.split(' ')[0] || ''})
          </div>
        </div>
      </div>
    </div>
  );
}
