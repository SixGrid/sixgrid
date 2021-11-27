var defaultKeymap = {
	"arrowleft": "previous",
	"arrowright": "next",
	"arrowup": "actionup",
	"arrowdown": "actiondown",
	"keyd": "download",
	"escape": "exit",
	"keyf": "favorite",
	"keys": "save",
	"keyc": "copylink"
};
var listenablePages = [
	'search',
	'settings'
]
var keymap = defaultKeymap;
module.exports = () => {
	console.debug(`[keylisten] => Called`);
	if (localStorage.keymap == undefined) {
		localStorage.keymap = JSON.stringify(defaultKeymap)
		console.debug(`[keylisten] No keymap was found so one was generated.`)
	}
	keymap = JSON.parse(localStorage.keymap)
	console.debug(`[keylisten] Current Keymap`,keymap)
	document.addEventListener('keydown',module.exports.listener) 
}

module.exports.resetKeymap = () =>
{
	localStorage.keymap = JSON.stringify(defaultKeymap);
	keymap = defaultKeymap;
}

module.exports.reloadKeymap = () =>
{
	keymap = JSON.parse(localStorage.keymap);
}

module.exports.listener = (g_keypress) => {
	if (!listenablePages.includes(localStorage.currentTab)) return;
	if (keymap[g_keypress.code.toLowerCase()] == undefined) return;
	if (localStorage.acceptKeyboardInput == 'false') return;
	console.debug(`[keylisten] page{${localStorage.currentTab}} => Recieved Valid Keyboard Input '${g_keypress.code}'`)
	switch(localStorage.currentTab) {
		case "search":
			esix.pages.search.keylisten(keymap[g_keypress.code.toLowerCase()])
			break;
		case "settings":
			esix.pages.settings.keylisten(keymap[g_keypress.code.toLowerCase()])
			break;
	}
	return;
}
