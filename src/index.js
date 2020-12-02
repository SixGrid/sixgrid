import { app, BrowserWindow } from 'electron';
if (require('electron-squirrel-startup')) {
	app.quit();
}
let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1024,
		height: 640,
		useContentSize: true,
		webPreferences: {
			nodeIntegration: true,
		},
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.webContents.openDevTools();
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};
app.on('ready', createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});


