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
echo Empacotando como instalador .exe (NSIS)...
call npx electron-builder --win --x64 --config electron-builder.yml
if %errorlevel% neq 0 (
    echo ERRO: Falha ao empacotar!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCESSO! O instalador esta em:
echo  electron-release\MonitoramentoAudiencia-Setup-X.X.X.exe
echo ========================================
echo.
echo Para PUBLICAR a atualizacao no GitHub Releases,
echo use o arquivo: publish-update.bat
echo ========================================
pause
