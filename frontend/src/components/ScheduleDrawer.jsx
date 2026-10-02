import React from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sprout, 
  ArrowRight, 
  MapPin, 
  AlertCircle 
} from 'lucide-react';

export default function ScheduleDrawer({ 
  isOpen, 
  onClose, 
  schedules, 
  onUpdateStatus, 
  onDeleteSchedule, 
  onViewFullSchedule,
  user,
  onOpenAuth
}) {
  if (!isOpen) return null;

  const today = new Date();

  const getDaysRemaining = (harvestDateStr) => {
    if (!harvestDateStr) return null;
    const harvest = new Date(harvestDateStr);
    const diffTime = harvest - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercent = (plantedDateStr, harvestDateStr) => {
    if (!plantedDateStr || !harvestDateStr) return 0;
    const planted = new Date(plantedDateStr);
    const harvest = new Date(harvestDateStr);
    const total = harvest - planted;
    const elapsed = today - planted;
    if (total <= 0) return 100;
    if (elapsed <= 0) return 0;
    const pct = Math.min(100, Math.round((elapsed / total) * 100));
    return pct;
  };

  const activeCount = schedules.filter(s => s.status === 'growing').length;
  const readyCount = schedules.filter(s => s.status === 'ready').length;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            <ShoppingBag size={20} color="#16a34a" />
            <span>Garden Bag & Schedule</span>
            <span style={{ fontSize: '0.8rem', background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.5rem', borderRadius: '999px' }}>
              {schedules.length} Items
            </span>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {!user ? (
            <div className="cart-empty">
              <AlertCircle size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
              <h3>Sign In Required</h3>
              <p style={{ marginTop: '0.4rem', fontSize: '0.9rem' }}>
                Please sign in to view and manage your scheduled garden crops.
              </p>
              <button 
                className="btn-primary" 
                style={{ marginTop: '1.25rem' }}
                onClick={onOpenAuth}
              >
                Sign In Now
              </button>
            </div>
          ) : schedules.length === 0 ? (
            <div className="cart-empty">
              <Sprout size={56} className="cart-empty-icon" />
              <h3>Your Garden Bag is Empty</h3>
              <p style={{ marginTop: '0.4rem', fontSize: '0.85rem' }}>
                Explore our catalog and click "Add to Calendar" on any crop to start planning your harvest timeline!
              </p>
            </div>
          ) : (
            schedules.map((item) => {
              const crop = item.crop_details || {};
              const daysLeft = getDaysRemaining(item.estimated_harvest_date);
              const progressPct = getProgressPercent(item.planted_date, item.estimated_harvest_date);

              return (
                <div key={item.id} className="schedule-item-card">
                  <div className="schedule-item-top">
                    <img 
                      src={crop.image_url || 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?auto=format&fit=crop&w=800&q=80'} 
                      alt={crop.name} 
                      className="schedule-thumb"
                    />
                    <div className="schedule-info">
                      <div className="schedule-crop-name">{crop.name}</div>
                      <div className="schedule-crop-category">
                        {crop.category_name} • {crop.growth_days} days cycle
                      </div>

                      <div className="schedule-dates">
                        <div className="date-row">
                          <span>Planted:</span>
                          <span className="date-val">{item.planted_date}</span>
                        </div>
                        <div className="date-row">
                          <span>Harvest:</span>
                          <span className="date-val" style={{ color: '#15803d' }}>
                            {item.estimated_harvest_date || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600' }}>
                      <span style={{ color: '#64748b' }}>Growth Progress</span>
                      <span style={{ color: daysLeft <= 0 ? '#16a34a' : '#0f172a' }}>
                        {daysLeft <= 0 ? 'Ready to harvest!' : `${daysLeft} days remaining (${progressPct}%)`}
                      </span>
                    </div>
                    <div className="growth-progress-wrap">
                      <div 
                        className="growth-progress-bar" 
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Controls / Status Switcher */}
                  <div className="schedule-item-controls">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Status:</span>
                      <select 
                        className="select-input"
                        style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                      >
                        <option value="planned">Planned</option>
                        <option value="growing">Growing</option>
                        <option value="ready">Ready to Harvest</option>
                        <option value="harvested">Harvested</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Qty: <b>{item.quantity}</b>
                      </span>
                      <button 
                        className="close-btn"
                        style={{ color: '#dc2626' }}
                        onClick={() => onDeleteSchedule(item.id)}
                        title="Remove from schedule"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Drawer Footer */}
        {user && schedules.length > 0 && (
          <div className="drawer-footer">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#64748b' }}>Active in Garden:</span>
              <span style={{ fontWeight: '700' }}>{activeCount} varieties growing</span>
            </div>
            {readyCount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#854d0e', fontWeight: '700' }}>
                <span>Ready to Harvest:</span>
                <span>{readyCount} varieties</span>
              </div>
            )}
            <button 
              className="btn-primary" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={() => {
                onClose();
                onViewFullSchedule();
              }}
            >
              <span>View Full Calendar Timeline</span>
              <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
