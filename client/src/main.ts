import { app, BrowserWindow } from 'electron';
import isDev from 'electron-is-dev';
import { TrayMenu } from '@/electron/TrayMenu';

const createWindow = (): void => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    win.loadURL(
        isDev
            ? 'http://localhost:9000'
            : `file://${app.getAppPath()}/index.html`
    );
};

const appElements: any = {
    tray: null,
    windows: null
};

app.on('ready', () => {
    appElements.tray = new TrayMenu();
    appElements.windows = createWindow();
});
