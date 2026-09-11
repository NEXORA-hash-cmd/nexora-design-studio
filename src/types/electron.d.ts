export interface ElectronAPI {
  isElectron: boolean;
  platform: string;
  getAppInfo: () => Promise<{
    name: string;
    version: string;
    platform: string;
    isPackaged: boolean;
  }>;
  saveFile: (options: {
    title?: string;
    defaultPath?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
    data: string | Uint8Array;
    encoding?: string;
  }) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
  openFile: (options: {
    title?: string;
    filters?: Array<{ name: string; extensions: string[] }>;
  }) => Promise<{ success: boolean; filePath?: string; content?: string; canceled?: boolean; error?: string }>;
  printToPDF: (options: {
    defaultPath?: string;
  }) => Promise<{ success: boolean; filePath?: string; canceled?: boolean; error?: string }>;
  minimize: () => Promise<void>;
  maximize: () => Promise<void>;
  close: () => Promise<void>;
  isMaximized: () => Promise<boolean>;
  openExternal: (url: string) => Promise<{ success: boolean; error?: string }>;
  showItemInFolder: (path: string) => Promise<{ success: boolean; error?: string }>;
  onMenuAction: (callback: (action: string) => void) => () => void;
}

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}
