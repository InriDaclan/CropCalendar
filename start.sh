#!/bin/bash
# Start backend
echo "🌱 Starting Django Backend on port 8000..."
./backend/venv/bin/python backend/manage.py runserver 0.0.0.0:8000 &
BACKEND_PID=$!

# Start frontend
echo "🌿 Starting React Frontend on port 5173..."
cd frontend && npm run dev -- --host 0.0.0.0 --port 5173 &
FRONTEND_PID=$!

trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
wait
