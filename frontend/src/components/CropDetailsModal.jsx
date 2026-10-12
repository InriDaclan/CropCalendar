import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  Sun, 
  Droplets, 
  Sprout, 
  Layers, 
  Sparkles, 
  Star, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  Sliders 
} from 'lucide-react';

export default function CropDetailsModal({ 
  crop, 
  onClose, 
  onSchedule, 
  user, 
  onOpenAuth,
  onSubmitReview 
}) {
  if (!crop) return null;

  const todayStr = new Date().toISOString().split('T')[0];
  const [plantDate, setPlantDate] = useState(todayStr);
  const [plot, setPlot] = useState('Plot A (Main Bed)');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  // Interactive Growth Stage Simulator Slider
  const [simulatedDay, setSimulatedDay] = useState(Math.round(crop.growth_days * 0.4));

  // Reviews & Rating State
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'simulator', 'reviews'
  const [newRating, setNewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState('');
  const [newOutcome, setNewOutcome] = useState('Bountiful Harvest');
  const [newDaysTaken, setNewDaysTaken] = useState(crop.growth_days);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Calculate projected harvest date based on growth_days
  const calculateHarvestDate = (dateString, days) => {
    try {
      const d = new Date(dateString);
      d.setDate(d.getDate() + Number(days));
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return '';
    }
  };

  const estHarvest = calculateHarvestDate(plantDate, crop.growth_days);
  const simMilestoneDate = calculateHarvestDate(plantDate, simulatedDay);

  // Growth Stage Details computation
  const getSimulatedStage = (day, totalDays, germDays) => {
    const pct = Math.round((day / totalDays) * 100);
    if (day <= germDays) {
      return {
        stageName: 'Stage 1: Seed Germination & Sprouting',
        badge: '🌱 Germination',
        color: '#16a34a',
        advice: 'Keep topsoil consistently damp. Protect seeds from heavy downpours. Sprout cotyledons should appear soon.',
        waterNeed: 'Gentle misting daily',
        soilDemand: 'Warm, airy seed starter'
      };
    } else if (pct <= 45) {
      return {
        stageName: 'Stage 2: Vegetative Growth & Root Expansion',
        badge: '🌿 Vegetative',
        color: '#0284c7',
        advice: 'Rapid stem and leaf growth. Thin seedlings if crowded. Provide balanced nitrogen fertilizer for lush foliage.',
        waterNeed: 'Deep watering 2-3 times/week',
        soilDemand: 'High Nitrogen compost'
      };
    } else if (pct <= 75) {
      return {
        stageName: 'Stage 3: Budding & Flowering / Tuber Formation',
        badge: '🌼 Flowering & Set',
        color: '#d97706',
        advice: 'Pollinators are crucial now. Switch to phosphorus/potassium-rich feed. Stake or support heavy branches.',
        waterNeed: 'Steady deep hydration at the base',
        soilDemand: 'Phosphorus & Potassium'
      };
    } else if (pct < 100) {
      return {
        stageName: 'Stage 4: Maturation & Sugar Accumulation',
        badge: '🍅 Ripening',
        color: '#ea580c',
        advice: 'Produce is sizing up and developing full flavor. Taper off excessive nitrogen to avoid vegetative delay.',
        waterNeed: 'Moderate, avoid wet leaves',
        soilDemand: 'Potassium boost'
      };
    } else {
      return {
        stageName: 'Stage 5: Peak Harvest & Culinary Viability',
        badge: '🧺 Peak Harvest',
        color: '#dc2626',
        advice: 'Flavor and nutritional value are at their absolute peak! Harvest early in the morning for crispest texture.',
        waterNeed: 'Cease heavy watering 24h prior to harvest',
        soilDemand: 'Prepare bed for companion rotation'
      };
    }
  };

  const stageInfo = getSimulatedStage(simulatedDay, crop.growth_days, crop.germination_days);

  const handleSubmitSchedule = (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    onSchedule({
      crop_id: crop.id,
      planted_date: plantDate,
      plot_location: plot,
      quantity: Number(quantity),
      notes: notes,
      status: 'planned'
    });
    onClose();
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onOpenAuth();
      return;
    }
    if (!newReviewText.trim()) return;

    setReviewSubmitting(true);
    try {
      await onSubmitReview({
        crop: crop.id,
        rating: Number(newRating),
        review_text: newReviewText.trim(),
        growth_outcome: newOutcome,
        actual_days_taken: Number(newDaysTaken)
      });
      setNewReviewText('');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#16a34a', letterSpacing: '0.05em' }}>
              {crop.category_name} • {crop.season} Season
            </span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: 1.2 }}>
              {crop.name}
            </h2>
            {crop.scientific_name && (
              <p style={{ fontSize: '0.85rem', color: '#64748b', fontStyle: 'italic' }}>
                {crop.scientific_name}
              </p>
            )}
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', padding: '0 1.5rem' }}>
          {[
            { id: 'overview', label: 'Overview & Schedule' },
            { id: 'simulator', label: '🌱 Growth Stage Simulator' },
            { id: 'reviews', label: `⭐ Community Notes (${crop.reviews?.length || 0})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '0.75rem 1rem',
                border: 'none',
                background: 'none',
                fontSize: '0.85rem',
                fontWeight: activeTab === tab.id ? '800' : '600',
                color: activeTab === tab.id ? '#16a34a' : '#64748b',
                borderBottom: activeTab === tab.id ? '3px solid #16a34a' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {activeTab === 'overview' && (
            <>
              <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem' }}>
                <img 
                  src={crop.image_url} 
                  alt={crop.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: '12px', 
                  left: '12px', 
                  background: 'rgba(22, 163, 74, 0.95)', 
                  color: 'white', 
                  padding: '0.4rem 0.85rem', 
                  borderRadius: '999px', 
                  fontWeight: '800', 
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }}>
                  <Clock size={16} />
                  <span>{crop.growth_days} Days to Harvest</span>
                </div>
              </div>

              <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                {crop.description}
              </p>

              {/* Quick Specs Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                gap: '0.75rem', 
                marginBottom: '1.25rem',
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Germination</div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{crop.germination_days} Days</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Spacing</div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{crop.spacing_cm} cm apart</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Harvest Window</div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{crop.harvest_window_days} Days</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Sunlight</div>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{crop.sunlight}</div>
                </div>
              </div>

              {crop.companion_plants && (
                <div style={{ marginBottom: '0.85rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#15803d', marginBottom: '0.2rem' }}>
                    🌿 Companion Plants:
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#334155' }}>{crop.companion_plants}</p>
                </div>
              )}

              {crop.planting_tips && (
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: '700', color: '#15803d', marginBottom: '0.2rem' }}>
                    💡 Cultivation Tips:
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#334155', background: '#f0fdf4', padding: '0.65rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid #22c55e' }}>
                    {crop.planting_tips}
                  </p>
                </div>
              )}

              {/* Schedule to Garden / Calendar Form */}
              <div style={{ 
                background: '#ffffff', 
                border: '2px solid #86efac', 
                borderRadius: '16px', 
                padding: '1.25rem',
                boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)'
              }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#14532d' }}>
                  <Calendar size={18} /> Schedule into Your Garden Plan
                </h3>

                <form onSubmit={handleSubmitSchedule}>
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Planting Date</label>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={plantDate}
                        onChange={(e) => setPlantDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Calculated Harvest Date</label>
                      <div style={{ 
                        padding: '0.65rem 0.85rem', 
                        background: '#f0fdf4', 
                        border: '1px solid #bbf7d0', 
                        borderRadius: '8px', 
                        fontWeight: '700', 
                        color: '#15803d',
                        fontSize: '0.9rem' 
                      }}>
                        🎉 {estHarvest || 'Calculated date'}
                      </div>
                    </div>
                  </div>

                  <div className="form-grid-2">
                    <div className="form-group">
                      <label className="form-label">Garden Plot / Location</label>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={plot}
                        onChange={(e) => setPlot(e.target.value)}
                        placeholder="e.g. Raised Bed 1"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Plant Quantity</label>
                      <input 
                        type="number" 
                        className="form-input" 
                        min="1" 
                        max="500"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Garden Notes (Optional)</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Direct seeded in row 2 with compost."
                    />
                  </div>

                  <button type="submit" className="btn-primary">
                    {user ? 'Add to Planting Schedule' : 'Sign In to Schedule'}
                  </button>
                </form>
              </div>
            </>
          )}

          {/* INTERACTIVE GROWTH STAGE SIMULATOR TAB */}
          {activeTab === 'simulator' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>
                  Interactive Lifecycle Simulator
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                  Drag the slider below to simulate growth from Day 0 through Day {crop.growth_days} harvest.
                </p>
              </div>

              {/* Slider Control */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#64748b' }}>
                    SOWING (Day 0)
                  </span>
                  <span style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: '800', 
                    color: stageInfo.color,
                    background: 'white',
                    padding: '0.25rem 0.85rem',
                    borderRadius: '999px',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid #e2e8f0'
                  }}>
                    Day {simulatedDay} of {crop.growth_days}
                  </span>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#15803d' }}>
                    HARVEST (Day {crop.growth_days})
                  </span>
                </div>

                <input 
                  type="range"
                  min="0"
                  max={crop.growth_days}
                  value={simulatedDay}
                  onChange={(e) => setSimulatedDay(Number(e.target.value))}
                  style={{
                    width: '100%',
                    height: '8px',
                    borderRadius: '999px',
                    accentColor: stageInfo.color,
                    cursor: 'pointer'
                  }}
                />

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748b', marginTop: '0.5rem' }}>
                  <span>Planted: {plantDate}</span>
                  <span>Simulated Date: <b>{simMilestoneDate}</b></span>
                  <span>Ready: {estHarvest}</span>
                </div>
              </div>

              {/* Dynamic Stage Details Card */}
              <div style={{
                background: '#ffffff',
                border: `2px solid ${stageInfo.color}`,
                borderRadius: '16px',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-md)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <span style={{ 
                    background: stageInfo.color, 
                    color: 'white', 
                    fontWeight: '800', 
                    fontSize: '0.85rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '999px' 
                  }}>
                    {stageInfo.badge}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '600' }}>
                    {Math.round((simulatedDay / crop.growth_days) * 100)}% to Full Harvest
                  </span>
                </div>

                <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.5rem' }}>
                  {stageInfo.stageName}
                </h4>

                <p style={{ fontSize: '0.9rem', color: '#334155', lineHeight: '1.5', marginBottom: '1rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px' }}>
                  <b>Grower Action:</b> {stageInfo.advice}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.82rem' }}>
                  <div style={{ background: '#f0fdf4', padding: '0.65rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <div style={{ color: '#166534', fontWeight: '700' }}>💧 Water Regime:</div>
                    <div style={{ color: '#0f172a' }}>{stageInfo.waterNeed}</div>
                  </div>
                  <div style={{ background: '#fefce8', padding: '0.65rem', borderRadius: '8px', border: '1px solid #fef08a' }}>
                    <div style={{ color: '#854d0e', fontWeight: '700' }}>🌱 Soil / Feeding:</div>
                    <div style={{ color: '#0f172a' }}>{stageInfo.soilDemand}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMMUNITY REVIEWS TAB */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800' }}>Grower Experience & Harvest Notes</h3>
                <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: '700', background: '#dcfce7', padding: '0.2rem 0.55rem', borderRadius: '999px' }}>
                  ★ {crop.avg_rating || '5.0'} / 5.0 Rating
                </span>
              </div>

              {/* Submit Review Form */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: '700', marginBottom: '0.6rem' }}>
                  Post Your Growth Notes (Auto-Approved)
                </h4>
                <form onSubmit={handleReviewSubmit}>
                  <div className="form-grid-3" style={{ marginBottom: '0.6rem' }}>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Rating</label>
                      <select 
                        className="form-select"
                        value={newRating}
                        onChange={(e) => setNewRating(e.target.value)}
                      >
                        <option value="5">★★★★★ 5 Stars (Bountiful)</option>
                        <option value="4">★★★★☆ 4 Stars (Good Yield)</option>
                        <option value="3">★★★☆☆ 3 Stars (Average)</option>
                        <option value="2">★★☆☆☆ 2 Stars (Struggled)</option>
                        <option value="1">★☆☆☆☆ 1 Star (Failed)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Outcome</label>
                      <select 
                        className="form-select"
                        value={newOutcome}
                        onChange={(e) => setNewOutcome(e.target.value)}
                      >
                        <option value="Bountiful Harvest">Bountiful Harvest</option>
                        <option value="Quick Producer">Quick Producer</option>
                        <option value="Delicious Flavor">Delicious Flavor</option>
                        <option value="Needs Pest Control">Needs Pest Control</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Actual Days</label>
                      <input 
                        type="number" 
                        className="form-input"
                        value={newDaysTaken}
                        onChange={(e) => setNewDaysTaken(e.target.value)}
                        placeholder="Days"
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '0.6rem' }}>
                    <input 
                      type="text" 
                      className="form-input"
                      placeholder="Share tips about watering, soil, or taste..."
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={reviewSubmitting}
                    style={{ width: 'auto', padding: '0.45rem 0.9rem', fontSize: '0.85rem' }}
                  >
                    {user ? (reviewSubmitting ? 'Posting...' : 'Submit Note') : 'Sign In to Post'}
                  </button>
                </form>
              </div>

              {/* Reviews List */}
              {crop.reviews?.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.85rem' }}>
                  No community notes yet. Be the first to share your harvest results!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {crop.reviews?.map((r) => (
                    <div key={r.id} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ fontWeight: '700', fontSize: '0.85rem' }}>{r.username}</span>
                          <span style={{ color: '#eab308', fontSize: '0.85rem' }}>
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '0.15rem 0.5rem', borderRadius: '999px', fontWeight: '700' }}>
                          {r.growth_outcome} {r.actual_days_taken ? `(${r.actual_days_taken}d)` : ''}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: '#334155' }}>{r.review_text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
