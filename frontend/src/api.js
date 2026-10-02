const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const getAuthToken = () => localStorage.getItem('crop_token') || '';
export const setAuthToken = (token) => {
  if (token) localStorage.setItem('crop_token', token);
  else localStorage.removeItem('crop_token');
};

export const getSavedUser = () => {
  try {
    const raw = localStorage.getItem('crop_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

export const setSavedUser = (user) => {
  if (user) localStorage.setItem('crop_user', JSON.stringify(user));
  else localStorage.removeItem('crop_user');
};

const authHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Token ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(username, password) {
    const res = await fetch(`${API_BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async register(username, password, email, is_staff = false) {
    const res = await fetch(`${API_BASE}/auth/register/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email, is_staff })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to register');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me/`, {
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Unauthorized');
    return res.json();
  },

  // Stats
  async getStats() {
    const res = await fetch(`${API_BASE}/stats/`);
    return res.json();
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories/`);
    return res.json();
  },

  // Crops
  async getCrops(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '' && v !== 'all') {
        query.append(k, v);
      }
    });
    const qStr = query.toString();
    const url = `${API_BASE}/crops/${qStr ? '?' + qStr : ''}`;
    const res = await fetch(url, { headers: authHeaders() });
    return res.json();
  },

  async createCrop(cropData) {
    const res = await fetch(`${API_BASE}/crops/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(cropData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
    return res.json();
  },

  async updateCrop(id, cropData) {
    const res = await fetch(`${API_BASE}/crops/${id}/`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(cropData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
    return res.json();
  },

  async deleteCrop(id) {
    const res = await fetch(`${API_BASE}/crops/${id}/`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete crop');
    return true;
  },

  // Schedules (Cart / Garden Planner)
  async getSchedules(viewAll = false) {
    const url = `${API_BASE}/schedules/${viewAll ? '?all=true' : ''}`;
    const res = await fetch(url, { headers: authHeaders() });
    if (!res.ok) return [];
    return res.json();
  },

  async createSchedule(scheduleData) {
    const res = await fetch(`${API_BASE}/schedules/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(scheduleData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
    return res.json();
  },

  async updateSchedule(id, scheduleData) {
    const res = await fetch(`${API_BASE}/schedules/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify(scheduleData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
    return res.json();
  },

  async deleteSchedule(id) {
    const res = await fetch(`${API_BASE}/schedules/${id}/`, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete schedule item');
    return true;
  },

  // Interactive Weather & Climate Advisory
  async getWeather() {
    const res = await fetch(`${API_BASE}/weather/`);
    if (!res.ok) return null;
    return res.json();
  },

  // Community Reviews & Grow Outcomes
  async getReviews(cropId = null) {
    const url = cropId ? `${API_BASE}/reviews/?crop_id=${cropId}` : `${API_BASE}/reviews/`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return res.json();
  },

  async createReview(reviewData) {
    const res = await fetch(`${API_BASE}/reviews/`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(reviewData)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(JSON.stringify(err));
    }
    return res.json();
  }
};

