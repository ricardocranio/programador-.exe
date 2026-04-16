@echo off
echo ========================================
echo  Publicar Atualizacao no GitHub Releases
echo ========================================
echo.
echo IMPORTANTE: Antes de rodar este script:
echo  1. Aumente a "version" no package.json (ex: 1.0.0 -^> 1.0.1)
echo  2. Defina seu GitHub Token na variavel GH_TOKEN
echo     (Settings -^> Developer Settings -^> Personal Access Tokens)
echo     Escopo necessario: repo
echo.

if "%GH_TOKEN%"=="" (
    echo ERRO: A variavel de ambiente GH_TOKEN nao esta definida!
    echo.
    echo Para definir agora nesta sessao, execute:
    echo   set GH_TOKEN=ghp_seuTokenAqui
    echo.
    pause
    exit /b 1
)

echo Token detectado. Continuando...
echo.

echo Gerando build do projeto...
call npx vite build
if %errorlevel% neq 0 (
    echo ERRO: Falha no build!
    pause
    exit /b 1
)

echo.
echo Empacotando e publicando no GitHub Releases...
call npx electron-builder --win --x64 --config electron-builder.yml --publish always
if %errorlevel% neq 0 (
    echo ERRO: Falha ao publicar!
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCESSO! Release publicada no GitHub.
echo  Acesse:
echo  https://github.com/ricardocranio/programador-.exe/releases
echo.
echo  Os usuarios receberao a atualizacao
echo  automaticamente na proxima abertura do app!
echo ========================================
pause
