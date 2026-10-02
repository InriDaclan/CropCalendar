import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Sprout, 
  CheckCircle2, 
  Trash2, 
  Plus, 
  MapPin, 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  Droplet, 
  Sparkles,
  AlertCircle 
} from 'lucide-react';

export default function ScheduleView({ 
  schedules, 
  onUpdateStatus, 
  onDeleteSchedule, 
  onBackToCatalog, 
  user, 
  onOpenAuth 
}) {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' (visual plot map) or 'list' (timeline)
  const [filterStatus, setFilterStatus] = useState('all');
  const [wateredPlots, setWateredPlots] = useState({});
  const today = new Date();

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1.5rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '600px', margin: '2rem auto' }}>
        <Calendar size={56} color="#16a34a" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Personal Crop Calendar & Plot Planner</h2>
        <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
          Please log in to manage your garden's planting dates, track maturity timelines, and prepare for harvests.
        </p>
        <button className="btn-primary" onClick={onOpenAuth} style={{ maxWidth: '240px', margin: '0 auto' }}>
          Sign In / Register (Auto-Approved)
        </button>
      </div>
    );
  }

  const filtered = schedules.filter(item => {
    if (filterStatus === 'all') return true;
    return item.status === filterStatus;
  });

  const getDaysRemaining = (harvestDateStr) => {
    if (!harvestDateStr) return null;
    const harvest = new Date(harvestDateStr);
    const diffTime = harvest - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getProgress = (plantedStr, harvestStr) => {
    if (!plantedStr || !harvestStr) return 0;
    const planted = new Date(plantedStr);
    const harvest = new Date(harvestStr);
    const total = harvest - planted;
    const elapsed = today - planted;
    if (total <= 0) return 100;
    if (elapsed <= 0) return 0;
    return Math.min(100, Math.round((elapsed / total) * 100));
  };

  const countGrowing = schedules.filter(s => s.status === 'growing').length;
  const countPlanned = schedules.filter(s => s.status === 'planned').length;
  const countReady = schedules.filter(s => s.status === 'ready').length;

  // Group schedules by plot location for the interactive visual bed planner
  const plotGroups = schedules.reduce((acc, item) => {
    const loc = item.plot_location || 'General Garden';
    if (!acc[loc]) acc[loc] = [];
    acc[loc].push(item);
    return acc;
  }, {});

  const handleWaterPlot = (plotName) => {
    setWateredPlots(prev => ({
      ...prev,
      [plotName]: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  };

  return (
    <div>
      {/* Header & Mode Switcher */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button 
            onClick={onBackToCatalog} 
            className="nav-btn" 
            style={{ marginBottom: '0.6rem' }}
          >
            <ArrowLeft size={16} />
            <span>Back to Crop Market</span>
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
            {user.username}'s Garden Calendar & Plot Visualizer
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            Real-time harvest projections and interactive garden bed placement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          {/* View Toggle */}
          <div style={{ background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', display: 'flex', gap: '0.2rem' }}>
            <button
              className={`nav-btn ${viewMode === 'grid' ? 'active' : ''}`}
              style={{ padding: '0.45rem 0.8rem', border: 'none', borderRadius: '8px', fontSize: '0.825rem' }}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid size={15} />
              <span>Visual Beds</span>
            </button>
            <button
              className={`nav-btn ${viewMode === 'list' ? 'active' : ''}`}
              style={{ padding: '0.45rem 0.8rem', border: 'none', borderRadius: '8px', fontSize: '0.825rem' }}
              onClick={() => setViewMode('list')}
            >
              <List size={15} />
              <span>Timeline List</span>
            </button>
          </div>

          <button className="btn-primary" onClick={onBackToCatalog} style={{ width: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <Plus size={16} />
            <span>Add Crops</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: 'white', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Scheduled Varieties</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a' }}>{schedules.length} crops</div>
        </div>
        <div style={{ background: 'white', padding: '1.2rem', borderRadius: '12px', border: '1px solid #bbf7d0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '700', textTransform: 'uppercase' }}>Actively Growing</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#16a34a' }}>{countGrowing} active</div>
        </div>
        <div style={{ background: 'white', padding: '1.2rem', borderRadius: '12px', border: '1px solid #fef08a', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#854d0e', fontWeight: '700', textTransform: 'uppercase' }}>Ready for Harvest</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#ca8a04' }}>{countReady} ready</div>
        </div>
        <div style={{ background: 'white', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e0e7ff', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ fontSize: '0.8rem', color: '#3730a3', fontWeight: '700', textTransform: 'uppercase' }}>Planned Sowing</div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#4f46e5' }}>{countPlanned} scheduled</div>
        </div>
      </div>

      {/* Filter Chips */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {[
          { key: 'all', label: 'All Items' },
          { key: 'growing', label: `Growing (${countGrowing})` },
          { key: 'ready', label: `Ready to Harvest (${countReady})` },
          { key: 'planned', label: `Planned (${countPlanned})` },
          { key: 'harvested', label: 'Completed / Harvested' }
        ].map((f) => (
          <button
            key={f.key}
            className={`cat-chip ${filterStatus === f.key ? 'active' : ''}`}
            onClick={() => setFilterStatus(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* VIEW MODE 1: INTERACTIVE VISUAL GARDEN BED MAP */}
      {viewMode === 'grid' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
          {Object.keys(plotGroups).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <Sprout size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>No plots configured</h3>
              <p style={{ color: '#64748b', marginTop: '0.3rem' }}>Add crops from the catalog to populate your garden plots.</p>
            </div>
          ) : (
            Object.entries(plotGroups).map(([plotName, items]) => {
              const lastWatered = wateredPlots[plotName];
              return (
                <div key={plotName} style={{
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {/* Bed Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ background: '#78350f', color: 'white', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>{plotName}</h3>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          {items.length} Varieties Planted • Soil: Fertile Loam
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      {lastWatered && (
                        <span style={{ fontSize: '0.75rem', color: '#0284c7', background: '#e0f2fe', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: '600' }}>
                          💧 Watered at {lastWatered}
                        </span>
                      )}
                      <button
                        onClick={() => handleWaterPlot(plotName)}
                        style={{
                          background: '#f0fdf4',
                          border: '1px solid #86efac',
                          color: '#15803d',
                          padding: '0.35rem 0.75rem',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}
                      >
                        <Droplet size={14} color="#0284c7" />
                        <span>Log Bed Watering</span>
                      </button>
                    </div>
                  </div>

                  {/* Bed Slots Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
                    {items.map((item) => {
                      const crop = item.crop_details || {};
                      const daysLeft = getDaysRemaining(item.estimated_harvest_date);
                      const progress = getProgress(item.planted_date, item.estimated_harvest_date);

                      return (
                        <div key={item.id} style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          borderRadius: '12px',
                          padding: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.6rem',
                          position: 'relative'
                        }}>
                          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <img 
                              src={crop.image_url} 
                              alt={crop.name}
                              style={{ width: '56px', height: '56px', borderRadius: '8px', objectFit: 'cover' }} 
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: '800', fontSize: '0.95rem', color: '#0f172a' }}>
                                {crop.name}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                Qty: <b>{item.quantity}</b> • Cycle: <b>{crop.growth_days}d</b>
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: '700' }}>
                                {daysLeft <= 0 ? '🎉 Ready to pick!' : `${daysLeft}d to harvest`}
                              </div>
                            </div>
                          </div>

                          <div className="growth-progress-wrap" style={{ height: '6px' }}>
                            <div className="growth-progress-bar" style={{ width: `${progress}%` }} />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.4rem', borderTop: '1px solid #e2e8f0' }}>
                            <select
                              className="select-input"
                              style={{ fontSize: '0.75rem', padding: '0.2rem 0.4rem' }}
                              value={item.status}
                              onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                            >
                              <option value="planned">Planned</option>
                              <option value="growing">Growing</option>
                              <option value="ready">Ready</option>
                              <option value="harvested">Harvested</option>
                            </select>

                            <button
                              onClick={() => onDeleteSchedule(item.id)}
                              className="close-btn"
                              style={{ color: '#dc2626', padding: '0.2rem' }}
                              title="Clear plant"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: TIMELINE LIST */}
      {viewMode === 'list' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {filtered.map((item) => {
            const crop = item.crop_details || {};
            const daysLeft = getDaysRemaining(item.estimated_harvest_date);
            const progress = getProgress(item.planted_date, item.estimated_harvest_date);

            return (
              <div key={item.id} style={{ 
                background: 'white', 
                border: '1px solid #e2e8f0', 
                borderRadius: '16px', 
                padding: '1.25rem',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem'
              }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <img 
                    src={crop.image_url} 
                    alt={crop.name} 
                    style={{ width: '80px', height: '80px', borderRadius: '12px', objectFit: 'cover' }} 
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>{crop.name}</h3>
                      <button 
                        onClick={() => onDeleteSchedule(item.id)} 
                        className="close-btn"
                        style={{ color: '#dc2626' }}
                        title="Delete schedule"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {crop.category_name} • <b>{crop.growth_days} Growth Days</b>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.3rem', fontSize: '0.8rem', color: '#475569' }}>
                      <MapPin size={13} color="#16a34a" />
                      <span>{item.plot_location} ({item.quantity} plants)</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ color: '#64748b' }}>Planted Date:</span>
                    <b>{item.planted_date}</b>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#64748b' }}>Projected Harvest:</span>
                    <b style={{ color: '#16a34a' }}>{item.estimated_harvest_date}</b>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#64748b' }}>Growth Lifecycle</span>
                    <span style={{ color: daysLeft <= 0 ? '#16a34a' : '#0f172a' }}>
                      {daysLeft <= 0 ? 'Maturity Reached! Harvest now' : `${daysLeft} days until harvest (${progress}%)`}
                    </span>
                  </div>
                  <div className="growth-progress-wrap">
                    <div className="growth-progress-bar" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '600', color: '#64748b' }}>Stage:</span>
                  <select 
                    className="select-input"
                    value={item.status}
                    onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                  >
                    <option value="planned">📅 Planned</option>
                    <option value="growing">🌿 Actively Growing</option>
                    <option value="ready">🧺 Ready to Harvest</option>
                    <option value="harvested">✅ Harvested</option>
                  </select>
                </div>

                {item.notes && (
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', background: '#fefce8', padding: '0.4rem 0.6rem', borderRadius: '6px' }}>
                    Notes: {item.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
