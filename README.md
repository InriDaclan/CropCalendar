# 🌱 CropCalendar - Growth Days & Harvest Marketplace

**CropCalendar** is a full-stack web application designed with an **e-commerce shopping UI**, but instead of prices, every crop prominently features its **Growth Days** to harvest. Users and administrators can browse crop varieties, filter by season or maturity timeline, and schedule plantings directly into their personal garden calendar.

---


## Preview 

![Home Page](Screenshot%from%2026-10-02%12-58-06.png)

## 🌟 Key Features

### 1. Shopping UI with Growth Days Instead of Prices
- Product cards display vibrant crop imagery, species information, difficulty ratings, sun/water requirements.
- **Price tag replacement**: A prominent highlight badge displaying `⏱️ [X] DAYS` from sowing to harvest (alongside germination & harvest window specs).
- "Add to Calendar" quick action (acts like "Add to Cart").
- Filter by Category (Vegetables, Leafy Greens, Fruits & Berries, Root Vegetables, Herbs, Legumes), Season, Difficulty, or Max Growth Days (e.g. Under 30d, 60d, 90d).
- Sort by Fastest Yield, Longest Yield, or Alphabetical.

### 2. Role-Based Authentication & User Accounts
- **Admin User (`admin` / `admin123`)**: Can add new crop varieties to the catalog, edit growth days/details, and delete crops.
- **Gardener User (`gardener` / `user123`)**: Can browse crops, add crops to their personal planting schedule, and track maturity.
- New user registration with instant token authentication.
- Instant 1-Click Demo Login in the authentication modal.

> ⚠️ **Security Note**: Demo account credentials are widely known. Never enable demo accounts in production environments.

### 3. Garden Bag & Schedule Drawer (The "Cart")
- Slide-out drawer showing all scheduled crops.
- Auto-calculated projected harvest dates (`Planted Date + Growth Days`).
- Live Growth Progress bar and days-remaining countdown.
- Status tracking (`Planned`, `Growing`, `Ready to Harvest`, `Harvested`).

### 4. Full Calendar & Timeline View
- Dedicated timeline tab with active garden statistics (varieties growing, harvest-ready crops, planned sowings).
- Filter by growth stages and manage plot locations & garden notes.

### 5. Crop Details Modal (Product Quick-View)
- Deep dive into planting depth, companion plants, spacing, and expert cultivation advice.
- Interactive sowing date calculator projecting harvest dates before adding to schedule.

---

## 🛠️ Tech Stack
- **Frontend**: React, Vite, Lucide Icons
- **Backend**: Django, Django REST Framework (DRF)
- **Database**: SQLite (default), configurable to PostgreSQL via dj-database-url
- **Other**: Python-dotenv (environment variables), django-cors-headers (CORS support)

---

## 📁 Project Structure
```
cropcalendar-master/
├── backend/                 # Django backend
│   ├── cropcalendar_backend/ # Django settings and configuration
│   ├── crops/               # Django app for crop management
│   ├── venv/                # Python virtual environment
│   ├── manage.py            # Django management script
│   ├── requirements.txt     # Python dependencies
│   ├── .env.example         # Example environment variables
│   └── *.py                 # Various utility scripts
├── frontend/                # React frontend
│   ├── src/                 # Source code
│   │   ├── components/      # React components
│   │   ├── api.js           # API service layer
│   │   └── App.jsx          # Main application component
│   ├── public/              # Static assets
│   ├── .env.example         # Example environment variables
│   ├── package.json         # Node dependencies and scripts
│   └── package-lock.json    # Dependency lock file
├── .gitignore               # Git ignore rules
├── README.md                # This file
├── SETUP.txt                # Step-by-step setup guide
├── start.sh                 # Convenience script to start both servers
└── .claude/                 # Claude Code configuration
```

---

## 📋 Requirements
Before running the project, ensure you have installed:
- **Python 3.8+** (with pip)
- **Node.js 18+** (with npm)

No additional system dependencies are required for SQLite (the default database). For PostgreSQL, you need to have PostgreSQL installed and running.

---

## 🔐 Environment Variables
The project uses environment variables for configuration. Example files are provided:
- `backend/.env.example`
- `frontend/.env.example`

To configure the project, copy the example files to `.env` and fill in the values:

**Backend (.env):**
- `SECRET_KEY`: A secret key used for cryptographic signing (generate a unique value)
- `DEBUG`: Set to `True` for development, `False` for production
- `ALLOWED_HOSTS`: Comma-separated list of allowed host/domain names (e.g., `localhost,127.0.0.1`)
- `DATABASE_URL`: Database connection string (default: `sqlite:///db.sqlite3`)
  - For PostgreSQL: `postgres://user:password@localhost:5432/cropcalendar`
- `CREATE_DEMO_ACCOUNTS`: Set to `true` to enable demo admin/gardener accounts (development only)
- `AUTO_APPROVE_PERMISSIONS`: Whether to automatically approve permissions (default: false)
- `AUTO_APPROVE_STAFF`: Whether to automatically approve staff status (default: false)

**Frontend (.env):**
- `VITE_API_BASE`: Base URL for API requests (defaults to `/api`)
- `VITE_APP_NAME`: Application name (defaults to `CropCalendar`)
- `VITE_ENABLE_AUTO_APPROVE`: Enable auto-approve feature (defaults to `true`)

> ⚠️ **Important**: Never commit `.env` files to version control. They are already ignored by `.gitignore`.

---

## ⚙️ Backend Setup
Follow these steps to set up the Django backend:

1. **Enter the backend directory**
   ```bash
   cd backend
   ```

2. **Create a Python virtual environment**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment**
   ```bash
   # On Linux/macOS:
   source venv/bin/activate
   # On Windows:
   venv\Scripts\activate
   ```

4. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env to set your SECRET_KEY and other variables
   ```

6. **Run database migrations**
   ```bash
   python manage.py migrate
   ```

7. **(Optional) Create a superuser**
   ```bash
   python manage.py createsuperuser
   ```

8. **Start the Django development server**
   ```bash
   python manage.py runserver 0.0.0.0:8000
   ```

---

## ⚙️ Frontend Setup
Follow these steps to set up the React frontend:

1. **Enter the frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional)**
   ```bash
   cp .env.example .env
   # Edit .env if needed (e.g., to change VITE_API_BASE if backend runs on a different port or domain)
   ```

4. **Start the React development server**
   ```bash
   npm run dev
   ```

   The frontend will be available at `http://localhost:5173` by default.

---

## ▶️ Running the Full Project
You can start both servers simultaneously using the provided convenience script:

```bash
./start.sh
```

This will:
- Start the Django backend on `http://localhost:8000`
- Start the React frontend on `http://localhost:5173`

Alternatively, you can start them separately as described in the backend and frontend setup sections.

---

## 🔌 API
The frontend communicates with the backend via a RESTful API. The API base URL is configurable via the `VITE_API_BASE` environment variable in the frontend (defaults to `/api`).

### Authentication
- **Login**: `POST /api/auth/login/`
- **Register**: `POST /api/auth/register/`
- **Get current user**: `GET /api/auth/me/`

### Crops
- **List crops**: `GET /api/crops/`
- **Create crop**: `POST /api/crops/`
- **Update crop**: `PUT /api/crops/{id}/`
- **Delete crop**: `DELETE /api/crops/{id}/`

### Schedules (Garden Planner)
- **List schedules**: `GET /api/schedules/`
- **Create schedule**: `POST /api/schedules/`
- **Update schedule**: `PATCH /api/schedules/{id}/`
- **Delete schedule**: `DELETE /api/schedules/{id}/`

### Additional Endpoints
- **Stats**: `GET /api/stats/`
- **Weather**: `GET /api/weather/`
- **Reviews**: `GET /api/reviews/` (filter by `?crop_id=`)
- **Create review**: `POST /api/reviews/`

All endpoints requiring authentication use token-based authentication (Authorization: Token `<token>`).

---

## 🚀 Deployment Notes
For production deployment:
- Set `DEBUG=False` in backend/.env
- Set `ALLOWED_HOSTS` to your domain(s)
- Use a strong `SECRET_KEY`
- Consider using PostgreSQL or another production-ready database
- Disable demo accounts by ensuring `CREATE_DEMO_ACCOUNTS` is not set to `true`
- Configure proper HTTPS reverse proxy (e.g., Nginx, Apache)
- Collect static files: `python manage.py collectstatic`
