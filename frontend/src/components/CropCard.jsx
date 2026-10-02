import React from 'react';
import {
  Sun,
  Droplets,
  Eye,
  CalendarPlus,
  Clock,
  Edit3,
  Trash2,
  Check,
  Compass,
  Star,
  MapPin,
  Thermometer,
  Activity
} from 'lucide-react';
import CropImage from './CropImage';

export default function CropCard({
  crop,
  onQuickAdd,
  onViewDetails,
  user,
  onEditCrop,
  onDeleteCrop
}) {
  const isQuickGrow = crop.growth_days <= 30;
  const isMediumGrow = crop.growth_days > 30 && crop.growth_days <= 60;
  const isLongGrow = crop.growth_days > 60;

  const getGrowthLabel = () => {
    if (isQuickGrow) return 'Fast Harvest';
    if (isMediumGrow) return 'Medium Season';
    return 'Long Season';
  };

  const getGrowthColor = () => {
    if (isQuickGrow) return '#10b981';
    if (isMediumGrow) return '#f59e0b';
    return '#6366f1';
  };

  return (
    <div className="crop-card">
      {/* Plant Image Area with Overlay */}
      <div className="crop-image-wrap" onClick={() => onViewDetails(crop)}>
        <CropImage
          src={crop.image_url}
          alt={crop.name}
          className="crop-image"
        />
        <div className="plant-overlay">
          {/* Category Badge (top-left) */}
          <span className="category-badge">
            {crop.category_name}
          </span>
          {/* Season Badge (top-right) */}
          <span className="season-badge">
            {crop.season}
          </span>
          {/* Detail Button (bottom-right) */}
          <button
            className="detail-btn"
            title="View plant details"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(crop);
            }}
          >
            <Eye size={16} />
          </button>
        </div>
      </div>

      {/* Plant Information */}
      <div className="crop-info">
        <div className="plant-name-row">
          <h3 className="plant-name">{crop.name}</h3>
          {crop.scientific_name && (
            <div className="plant-scientific">{crop.scientific_name}</div>
          )}
        </div>

        {/* Description with line clamping */}
        <p className="plant-description">{crop.description}</p>

        {/* Metadata Grid - Growing Details */}
        <div className="metadata-grid">
          <div className="metadata-item">
            <Sun size={14} color="#f59e0b" />
            <span>{crop.sunlight}</span>
          </div>
          <div className="metadata-item">
            <Droplets size={14} color="#3b82f6" />
            <span>{crop.watering}</span>
          </div>
          <div className="metadata-item">
            <Star size={14} color="#eab308" />
            <span>{crop.difficulty}</span>
          </div>
          <div className="metadata-item">
            <MapPin size={14} color="#8b5cf6" />
            <span>{crop.origin || 'Various'}</span>
          </div>
        </div>

        {/* Harvest Information - Prominent */}
        <div className="harvest-prominent">
          <div className="harvest-info">
            <span className="harvest-icon">🌱</span>
            <div className="harvest-details">
              <div className="harvest-days">{crop.growth_days} days</div>
              <div className="harvest-label">to harvest</div>
            </div>
          </div>
          {/* Harvest Speed Indicator */}
          <div className="harvest-badge" style={{ backgroundColor: getGrowthColor() + '20', color: getGrowthColor() }}>
            {getGrowthLabel()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions">
          <button
            className="btn-schedule"
            onClick={() => onQuickAdd(crop)}
            title="Add to Your Garden"
          >
            <CalendarPlus size={16} />
            <span>Add to Garden</span>
          </button>
          <button
            className="btn-details"
            onClick={() => onViewDetails(crop)}
            title="View Full Details"
          >
            <Activity size={16} />
            <span>Growth Stages</span>
          </button>
        </div>
      </div>

      {/* Admin Controls */}
      {user?.is_staff && (
        <div className="admin-actions">
          <button
            className="admin-btn edit"
            onClick={() => onEditCrop(crop)}
            title="Edit crop"
          >
            <Edit3 size={14} />
            <span>Edit</span>
          </button>
          <button
            className="admin-btn delete"
            onClick={() => onDeleteCrop(crop.id, crop.name)}
            title="Delete crop"
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}