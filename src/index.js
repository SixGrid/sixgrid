import { app, BrowserWindow } from 'electron';
if (require('electron-squirrel-startup')) {
	app.quit();
}
let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		webPreferences: {
			nodeIntegration: true,
			v8CacheOptions: 'none',
		},
	});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.webContents.openDevTools(); //
	mainWindow.on('closed', () => {
		mainWindow = null;
	});
};
app.on('ready', createWindow);
app.getPath('userData');
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


