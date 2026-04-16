const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');

let mainWindow = null;

// Configurações do auto-updater
autoUpdater.autoDownload = true;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    icon: path.join(__dirname, '..', 'public', 'favicon.ico'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    autoHideMenuBar: true,
    title: 'Monitoramento de Audiência - Rádios de Natal/RN',
    show: false,
  });

  mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));

  // Show window when ready to avoid white flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open external links in system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// IPC handlers
ipcMain.handle('app:getVersion', () => app.getVersion());
ipcMain.handle('app:getPlatform', () => process.platform);

ipcMain.on('window:minimize', () => mainWindow?.minimize());
ipcMain.on('window:maximize', () => {
  if (mainWindow?.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow?.maximize();
  }
});
ipcMain.on('window:close', () => mainWindow?.close());

// ============================================
// AUTO-UPDATER - GitHub Releases
// ============================================

function setupAutoUpdater() {
  // Verifica updates 3 segundos após abrir
  setTimeout(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.error('Erro ao verificar atualizações:', err);
    });
  }, 3000);

  // Verifica novamente a cada 1 hora enquanto o app está aberto
  setInterval(() => {
    autoUpdater.checkForUpdates().catch((err) => {
      console.error('Erro ao verificar atualizações:', err);
    });
  }, 60 * 60 * 1000);
}

autoUpdater.on('checking-for-update', () => {
  console.log('Verificando atualizações...');
});

autoUpdater.on('update-available', (info) => {
  console.log('Atualização disponível:', info.version);
  if (mainWindow) {
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Atualização disponível',
      message: `Nova versão ${info.version} disponível!`,
      detail: 'A atualização está sendo baixada em segundo plano. Você será notificado quando estiver pronta para instalar.',
      buttons: ['OK'],
    });
  }
});

autoUpdater.on('update-not-available', () => {
  console.log('Nenhuma atualização disponível.');
});

autoUpdater.on('error', (err) => {
  console.error('Erro no auto-updater:', err);
});

autoUpdater.on('download-progress', (progressObj) => {
  const log = `Baixando: ${Math.round(progressObj.percent)}% (${Math.round(progressObj.transferred / 1024 / 1024)}MB / ${Math.round(progressObj.total / 1024 / 1024)}MB)`;
  console.log(log);
  if (mainWindow) {
    mainWindow.setProgressBar(progressObj.percent / 100);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Atualização baixada:', info.version);
  if (mainWindow) {
    mainWindow.setProgressBar(-1);
    dialog
      .showMessageBox(mainWindow, {
        type: 'info',
        title: 'Atualização pronta',
        message: `A versão ${info.version} foi baixada com sucesso!`,
        detail: 'Reinicie o aplicativo agora para aplicar a atualização.',
        buttons: ['Reiniciar agora', 'Mais tarde'],
        defaultId: 0,
        cancelId: 1,
      })
      .then((result) => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
  }
});

// IPC para checagem manual de updates (opcional, pode ser usado no futuro)
ipcMain.handle('updater:check', async () => {
  try {
    const result = await autoUpdater.checkForUpdates();
    return { success: true, version: result?.updateInfo?.version };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.whenReady().then(() => {
  createWindow();
  // Só ativa auto-updater em produção (app empacotado)
  if (app.isPackaged) {
    setupAutoUpdater();
  }
});

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
