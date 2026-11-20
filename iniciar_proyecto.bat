@echo off
title TicketEventos Bolivia - Iniciador Automatico
echo ===================================================================
echo     INICIADOR AUTOMATICO: TICKETEVENTOS BOLIVIA
echo     Equipo: Las Ovejas Negras De Tupiza (Programacion Avanzada)
echo ===================================================================
echo.

echo [1/2] Iniciando Backend Django REST API en puerto 8000...
start "Backend Django - Puerto 8000" cmd /k "cd /d "%~dp0ticketera_django_src" && py manage.py runserver 8000"

echo [2/2] Iniciando Frontend React (Vite) en puerto 3000...
start "Frontend React - Puerto 3000" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================================
echo   Los dos servidores se estan ejecutando:
echo     - Frontend React:  http://localhost:3000
echo     - Backend API:     http://localhost:8000/api/
echo     - Django Admin:    http://localhost:8000/admin/
echo ===================================================================
echo Abriendo la aplicacion en tu navegador...
timeout /t 3 >nul
start http://localhost:3000
