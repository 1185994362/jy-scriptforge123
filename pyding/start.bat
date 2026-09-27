@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo ==============================
echo  个人主页 - FastAPI 服务
echo  前端: ..\conding\
echo  后端: %~dp0
echo ==============================
echo.

:: 安装依赖
echo [1/2] 安装依赖...
py -m pip install -r requirements.txt -q
echo.

:: 启动
echo [2/2] 启动服务...
echo.
echo 打开浏览器访问: http://127.0.0.1:8000
echo 前端独立打开: ..\conding\index.html
echo 按 Ctrl+C 停止服务
echo.
py main.py

pause
