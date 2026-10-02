import React from 'react';
import {
  Sprout,
  Search,
  Calendar,
  User as UserIcon,
  LogOut,
  ShieldCheck,
  PlusCircle,
  LayoutGrid,
  List,
  Sparkles,
  ClipboardList
} from 'lucide-react';

export default function Navbar({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  scheduleCount,
  setIsDrawerOpen,
  user,
  onOpenAuth,
  onLogout,
  onOpenAddCrop
}) {
  return (
    <header className="navbar">
      <div className="nav-inner">
        {/* Brand */}
        <div className="brand-logo" onClick={() => setActiveTab('catalog')}>
          <div className="brand-icon">
            <Sprout size={22} />
          </div>
          <div>
            <span>CropCalendar</span>
            <span className="brand-badge">Garden Planner</span>
          </div>
        </div>

        {/* Search */}
        <div className="nav-search-wrap">
          <Search size={17} className="nav-search-icon" />
          <input
            type="text"
            className="nav-search-input"
            placeholder="Search crops by name, category, or variety..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Actions / Nav Buttons */}
        <div className="nav-actions">
          <button 
            className={`nav-btn ${activeTab === 'catalog' ? 'active' : ''}`}
            onClick={() => setActiveTab('catalog')}
          >
            <List size={16} />
            <span>Crop Catalog</span>
          </button>

          <button 
            className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={16} />
            <span>Garden Calendar</span>
          </button>

          {user?.is_staff && (
            <button 
              className="nav-btn"
              style={{ background: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}
              onClick={onOpenAddCrop}
              title="Add a new crop to the catalog"
            >
              <PlusCircle size={16} />
              <span>Add Crop</span>
            </button>
          )}

          {/* My Garden Button (replacing Garden Bag) */}
          <button 
            className="nav-btn cart-btn" 
            onClick={() => setIsDrawerOpen(true)}
            title="Open My Garden & Planting Schedule"
          >
            <ClipboardList size={17} />
            <span>My Garden</span>
            {scheduleCount > 0 && (
              <span className="cart-badge">{scheduleCount}</span>
            )}
          </button>

          {/* User Auth Info */}
          {user ? (
            <div className="user-pill">
              {user.is_staff ? (
                <ShieldCheck size={16} color="#d97706" />
              ) : (
                <UserIcon size={16} color="#16a34a" />
              )}
              <span>{user.username}</span>
              <span className={`user-role-tag ${user.is_staff ? 'user-role-admin' : 'user-role-user'}`}>
                {user.is_staff ? 'Admin' : 'Member'}
              </span>
              <button
                onClick={onLogout}
                className="close-btn"
                title="Log Out"
                style={{ padding: '0.2rem', marginLeft: '0.2rem' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button className="nav-btn active" onClick={onOpenAuth}>
              <UserIcon size={16} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
