@echo off

echo Running npm prestart...
cd "C:\Users\Administrator\Desktop\bn-trading-web"
start /wait cmd /c "npm run prestart"

echo Running npm dev...
start cmd /c "npm run dev"
timeout /t 3580 /nobreak
taskkill /f /im node.exe