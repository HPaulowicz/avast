import { app, Tray, Menu, nativeImage, dialog } from 'electron';

export class TrayMenu {
    public readonly tray: Tray;
    private iconPath: string = '/assets/tray-icon.png';

    constructor() {
        this.tray = new Tray(this.createNativeImage());
        this.tray.setContextMenu(this.createMenu());
    }

    createNativeImage() {
        const path = `${app.getAppPath()}${this.iconPath}`;
        const image = nativeImage.createFromPath(path);

        image.setTemplateImage(true);
        return image;
    }

    createMenu(): Menu {
        const contextMenu = Menu.buildFromTemplate([
            {
                label: 'About',
                type: 'normal',
                click: () => {
                    dialog.showMessageBox({
                        type: 'info',
                        buttons: ['Got it'],
                        defaultId: 1,
                        title: 'Info',
                        message: 'What is this app?',
                        detail: 'Avast engineering assessment.'
                    });
                }
            },
            {
                label: 'Quit',
                type: 'normal',
                click: () => app.quit()
            }
        ]);
        return contextMenu;
    }
}
