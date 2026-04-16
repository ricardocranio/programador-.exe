@echo off
echo ========================================
echo  Monitoramento de Audiencia - Build EXE
echo ========================================
echo.

echo Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo ERRO: Falha ao instalar dependencias!
    pause
    exit /b 1
)

echo.
echo Gerando build do projeto...
call npx vite build
if %errorlevel% neq 0 (
    echo ERRO: Falha no build!
    pause
    exit /b 1
)

echo.
echo Empacotando como .exe...
call npx @electron/packager . "MonitoramentoAudiencia" --platform=win32 --arch=x64 --out=electron-release --overwrite --ignore="node_modules" --ignore="^/src" --ignore="^/public" --ignore="^/electron-release"
if %errorlevel% neq 0 (
    echo ERRO: Falha ao empacotar!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCESSO! O .exe esta em:
echo  electron-release\MonitoramentoAudiencia-win32-x64\
echo ========================================
pause
