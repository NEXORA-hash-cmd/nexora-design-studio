const { app, BrowserWindow, ipcMain, dialog, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// In modern electron-builder, squirrel/nsis handles shortcuts natively.

let mainWindow = null;

function createMainWindow() {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged && Boolean(process.env.ELECTRON_START_URL);

  const iconPath = process.platform === 'win32'
    ? path.join(__dirname, '../public/icon.ico')
    : path.join(__dirname, '../public/icon.png');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1080,
    minHeight: 720,
    title: 'NEXORA',
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    show: false, // Wait until ready-to-show for smooth appearance
    backgroundColor: '#0B0F17', // Match dark studio theme
    autoHideMenuBar: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true,
      spellcheck: false,
    },
  });

  // Set Windows user model ID for notifications & taskbar grouping
  if (process.platform === 'win32') {
    app.setAppUserModelId('com.nexora.desktop');
  }

  // Build professional Windows application menu
  const menuTemplate = [
    {
      label: '&File',
      submenu: [
        {
          label: '&New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => mainWindow.webContents.send('menu:action', 'new-project')
        },
        {
          label: '&Open / Import Project...',
          accelerator: 'CmdOrCtrl+O',
          click: () => mainWindow.webContents.send('menu:action', 'import-project')
        },
        { type: 'separator' },
        {
          label: '&Save Project',
          accelerator: 'CmdOrCtrl+S',
          click: () => mainWindow.webContents.send('menu:action', 'save-project')
        },
        {
          label: 'Export as &JSON...',
          accelerator: 'CmdOrCtrl+Shift+J',
          click: () => mainWindow.webContents.send('menu:action', 'export-json')
        },
        {
          label: 'Export Financials to &CSV...',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => mainWindow.webContents.send('menu:action', 'export-csv')
        },
        {
          label: 'Export Executive Summary to &PDF...',
          accelerator: 'CmdOrCtrl+Shift+P',
          click: () => mainWindow.webContents.send('menu:action', 'export-pdf')
        },
        { type: 'separator' },
        {
          label: 'E&xit',
          accelerator: process.platform === 'win32' ? 'Alt+F4' : 'CmdOrCtrl+Q',
          click: () => app.quit()
        }
      ]
    },
    {
      label: '&Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' }
      ]
    },
    {
      label: '&View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: () => mainWindow.webContents.toggleDevTools()
        },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '&Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { role: 'close' }
      ]
    },
    {
      label: '&Help',
      submenu: [
        {
          label: '&License & Activation...',
          click: () => mainWindow.webContents.send('menu:action', 'open-license')
        },
        { type: 'separator' },
        {
          label: '&About NEXORA...',
          click: () => mainWindow.webContents.send('menu:action', 'open-about')
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Load content
  if (isDev && process.env.ELECTRON_START_URL) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    const indexPath = path.join(__dirname, '../dist/index.html');
    mainWindow.loadFile(indexPath);
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
      return { action: 'deny' };
    }
    return { action: 'allow' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  setupIpcHandlers();
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Setup IPC handlers for native Windows dialogs and filesystem
function setupIpcHandlers() {
  // App info
  ipcMain.handle('app:getInfo', () => ({
    name: 'NEXORA',
    version: app.getVersion() || '1.0.0',
    platform: process.platform,
    isPackaged: app.isPackaged,
  }));

  // Native Windows Save Dialog
  ipcMain.handle('dialog:saveFile', async (_event, options = {}) => {
    try {
      const { title = 'Save File', defaultPath, filters = [], data, encoding = 'utf-8' } = options;
      const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title,
        defaultPath: defaultPath || 'NEXORA-Project.json',
        filters,
      });

      if (canceled || !filePath) {
        return { canceled: true };
      }

      await fs.promises.writeFile(filePath, data, encoding);
      return { success: true, filePath };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // Native Windows Open Dialog
  ipcMain.handle('dialog:openFile', async (_event, options = {}) => {
    try {
      const { title = 'Open File', filters = [] } = options;
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title,
        properties: ['openFile'],
        filters,
      });

      if (canceled || !filePaths || filePaths.length === 0) {
        return { canceled: true };
      }

      const filePath = filePaths[0];
      const content = await fs.promises.readFile(filePath, 'utf-8');
      return { success: true, filePath, content };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // Native PDF Export
  ipcMain.handle('export:pdf', async (_event, options = {}) => {
    try {
      const { defaultPath = 'NEXORA-Report.pdf' } = options;
      const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Export PDF Report',
        defaultPath,
        filters: [{ name: 'PDF Documents', extensions: ['pdf'] }],
      });

      if (canceled || !filePath) {
        return { canceled: true };
      }

      // Generate PDF buffer from web contents
      const pdfBuffer = await mainWindow.webContents.printToPDF({
        marginsType: 1,
        pageSize: 'A4',
        printBackground: true,
        landscape: false,
      });

      await fs.promises.writeFile(filePath, pdfBuffer);
      return { success: true, filePath };
    } catch (err) {
      return { success: false, error: err.message };
    }
  });

  // Window controls
  ipcMain.handle('window:minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });

  ipcMain.handle('window:maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });

  ipcMain.handle('window:close', () => {
    if (mainWindow) mainWindow.close();
  });

  ipcMain.handle('window:isMaximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });

  // Shell open external safely
  ipcMain.handle('shell:openExternal', (_event, url) => {
    if (url && (url.startsWith('https://') || url.startsWith('http://'))) {
      shell.openExternal(url);
      return { success: true };
    }
    return { success: false, error: 'Invalid URL scheme' };
  });

  // Show in Windows Explorer
  ipcMain.handle('shell:showItemInFolder', (_event, fullPath) => {
    if (fullPath && fs.existsSync(fullPath)) {
      shell.showItemInFolder(fullPath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  });
}
