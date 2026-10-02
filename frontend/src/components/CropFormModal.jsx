import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';

export default function CropFormModal({ 
  isOpen, 
  onClose, 
  cropToEdit, 
  categories, 
  onSave 
}) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: '',
    scientific_name: '',
    category: categories[0]?.id || 1,
    growth_days: 60,
    image_url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80',
    description: '',
    season: 'Spring',
    difficulty: 'Easy',
    sunlight: 'Full Sun',
    watering: 'Moderate',
    germination_days: 7,
    spacing_cm: 30,
    harvest_window_days: 14,
    planting_tips: '',
    companion_plants: ''
  });

  const [error, setError] = useState('');

  useEffect(() => {
    if (cropToEdit) {
      setFormData({
        name: cropToEdit.name || '',
        scientific_name: cropToEdit.scientific_name || '',
        category: cropToEdit.category || categories[0]?.id || 1,
        growth_days: cropToEdit.growth_days || 60,
        image_url: cropToEdit.image_url || '',
        description: cropToEdit.description || '',
        season: cropToEdit.season || 'Spring',
        difficulty: cropToEdit.difficulty || 'Easy',
        sunlight: cropToEdit.sunlight || 'Full Sun',
        watering: cropToEdit.watering || 'Moderate',
        germination_days: cropToEdit.germination_days || 7,
        spacing_cm: cropToEdit.spacing_cm || 30,
        harvest_window_days: cropToEdit.harvest_window_days || 14,
        planting_tips: cropToEdit.planting_tips || '',
        companion_plants: cropToEdit.companion_plants || ''
      });
    }
  }, [cropToEdit, categories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ['growth_days', 'germination_days', 'spacing_cm', 'harvest_window_days', 'category'].includes(name)
        ? Number(value)
        : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await onSave(formData, cropToEdit?.id);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save crop');
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
            {cropToEdit ? 'Edit Crop Variety' : 'Add New Crop to Catalog'}
          </h2>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-grid-2">
              <div className="form-group">
                <label className="form-label">Crop Name *</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-input" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  placeholder="e.g. Cherry Tomato"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Scientific Name</label>
                <input 
                  type="text" 
                  name="scientific_name" 
                  className="form-input" 
                  value={formData.scientific_name} 
                  onChange={handleChange} 
                  placeholder="e.g. Solanum lycopersicum"
                />
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select 
                  name="category" 
                  className="form-select" 
                  value={formData.category} 
                  onChange={handleChange}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* CORE REQUIREMENT: GROWTH DAYS */}
              <div className="form-group">
                <label className="form-label" style={{ color: '#15803d', fontWeight: '700' }}>
                  Growth Days (Price Tag) *
                </label>
                <input 
                  type="number" 
                  name="growth_days" 
                  className="form-input" 
                  style={{ borderColor: '#86efac', background: '#f0fdf4' }}
                  min="1" 
                  max="400"
                  value={formData.growth_days} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Season *</label>
                <select 
                  name="season" 
                  className="form-select" 
                  value={formData.season} 
                  onChange={handleChange}
                >
                  <option value="Spring">Spring</option>
                  <option value="Summer">Summer</option>
                  <option value="Autumn">Autumn</option>
                  <option value="Winter">Winter</option>
                  <option value="All Season">All Season</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Image URL *</label>
              <input 
                type="url" 
                name="image_url" 
                className="form-input" 
                value={formData.image_url} 
                onChange={handleChange} 
                required 
                placeholder="https://..."
              />
            </div>

            <div className="form-group">
              <label className="form-label">Short Description *</label>
              <textarea 
                name="description" 
                className="form-textarea" 
                rows="3" 
                value={formData.description} 
                onChange={handleChange} 
                required 
                placeholder="Brief description of the crop variety and culinary use..."
              />
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Difficulty</label>
                <select name="difficulty" className="form-select" value={formData.difficulty} onChange={handleChange}>
                  <option value="Easy">Easy</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Sunlight</label>
                <select name="sunlight" className="form-select" value={formData.sunlight} onChange={handleChange}>
                  <option value="Full Sun">Full Sun (6+ hrs)</option>
                  <option value="Partial Shade">Partial Shade (3-6 hrs)</option>
                  <option value="Full Shade">Full Shade</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Watering</label>
                <select name="watering" className="form-select" value={formData.watering} onChange={handleChange}>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            <div className="form-grid-3">
              <div className="form-group">
                <label className="form-label">Germination (Days)</label>
                <input type="number" name="germination_days" className="form-input" value={formData.germination_days} onChange={handleChange} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Spacing (cm)</label>
                <input type="number" name="spacing_cm" className="form-input" value={formData.spacing_cm} onChange={handleChange} min="1" />
              </div>
              <div className="form-group">
                <label className="form-label">Harvest Window (Days)</label>
                <input type="number" name="harvest_window_days" className="form-input" value={formData.harvest_window_days} onChange={handleChange} min="1" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Planting Tips</label>
              <textarea name="planting_tips" className="form-textarea" rows="2" value={formData.planting_tips} onChange={handleChange} placeholder="Practical advice for successful cultivation..." />
            </div>

            <div className="form-group">
              <label className="form-label">Companion Plants</label>
              <input type="text" name="companion_plants" className="form-input" value={formData.companion_plants} onChange={handleChange} placeholder="e.g. Basil, Marigolds, Carrots" />
            </div>

            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <Save size={18} />
              <span>{cropToEdit ? 'Update Crop' : 'Create Crop'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
