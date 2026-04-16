# 🔄 Auto-Update - Guia de Uso

Sistema de atualização automática via **GitHub Releases** + **electron-updater**.

---

## 📦 Build Inicial (primeira instalação)

1. Abra o `package.json` e confirme a versão inicial:
   ```json
   "version": "1.0.0"
   ```
2. Execute:
   ```
   build-electron.bat
   ```
3. O instalador será gerado em:
   ```
   electron-release\MonitoramentoAudiencia-Setup-1.0.0.exe
   ```
4. Distribua esse `.exe` para os usuários (essa parte ainda é manual — só desta primeira vez).

---

## 🚀 Publicando Atualizações (versões futuras)

### Pré-requisitos (configurar uma única vez)

#### 1. Repositório GitHub público
O repo `ricardocranio/programador-.exe` precisa estar **público** para que os usuários possam baixar atualizações sem token.

#### 2. Gerar GitHub Token
1. Acesse: https://github.com/settings/tokens
2. **Generate new token (classic)**
3. Marque o escopo: **`repo`** (Full control of private repositories)
4. Copie o token (formato: `ghp_xxxxxxxxxxxx`)

#### 3. Configurar token no Windows
Abra o **CMD** e execute:
```cmd
setx GH_TOKEN "ghp_seuTokenAqui"
```
> ⚠️ Feche e abra o CMD novamente para o token ficar disponível.

---

### Lançando uma nova versão

1. **Aumente a versão** no `package.json`:
   ```json
   "version": "1.0.1"
   ```
2. **Execute o publicador**:
   ```
   publish-update.bat
   ```
3. O `electron-builder` vai:
   - Compilar o app
   - Gerar o instalador `.exe`
   - Criar uma **Release** no GitHub
   - Subir os arquivos: `MonitoramentoAudiencia-Setup-1.0.1.exe` + `latest.yml`

4. Acesse: https://github.com/ricardocranio/programador-.exe/releases
   - A release já vem **publicada** automaticamente.

---

## 👤 Experiência do Usuário Final

1. Usuário abre o app que já está instalado (ex: v1.0.0)
2. Após **3 segundos**, o app verifica o GitHub silenciosamente
3. Se houver versão nova:
   - Mostra um aviso: *"Nova versão 1.0.1 disponível!"*
   - Baixa em segundo plano (com barra de progresso na taskbar)
4. Quando termina o download:
   - Mostra dialog: *"Reiniciar agora?"*
   - Usuário clica **Reiniciar agora** → instala em segundos → abre na nova versão ✅

> O app também verifica atualizações a cada **1 hora** enquanto está aberto.

---

## ⚠️ Pontos de Atenção

| Item | Detalhe |
|------|---------|
| 🔒 **Aviso SmartScreen** | Sem certificado de assinatura, o Windows vai mostrar "Editor desconhecido" ao instalar/atualizar. O usuário precisa clicar em **"Mais informações" → "Executar mesmo assim"**. |
| 🌐 **Repo público obrigatório** | Para que o auto-update funcione sem token no lado do usuário, o repo `programador-.exe` precisa estar **público** no GitHub. |
| 🐛 **Não funciona em dev** | O auto-updater só roda no `.exe` empacotado. Rodando `npm run dev` ou `electron .` não dispara checagens. |
| 📈 **Sempre incremente a versão** | Se você publicar com a mesma versão do `package.json`, o auto-update **não detecta** como nova. Sempre aumente: 1.0.0 → 1.0.1 → 1.0.2 |

---

## 🔍 Troubleshooting

**O usuário não recebe a atualização?**
- Confirme que a release está **publicada** (não draft) no GitHub
- Confirme que o repo está **público**
- Confirme que a versão da release é **maior** que a instalada
- Peça pro usuário fechar e abrir o app (a checagem é no startup)

**Erro "GH_TOKEN not set" ao publicar?**
- Execute `setx GH_TOKEN "seu_token"` no CMD e reabra o terminal

**Erro 401/403 ao publicar?**
- Token expirou ou não tem o escopo `repo` — gere um novo

---

## 📂 Arquivos do Sistema

- `electron/main.cjs` — Lógica do auto-updater
- `electron-builder.yml` — Configuração do empacotador e GitHub
- `build-electron.bat` — Build local (sem publicar)
- `publish-update.bat` — Build + publica no GitHub Releases
