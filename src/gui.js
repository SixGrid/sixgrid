global.esix = {
	modules: {
		esixapi: require("esix-api"),
		jquery: require("jquery")
	},
	functions: {
		search: require("./search"),
		home: require("./home"),
		settings: require("./settings")
	},
	pageManager: require("./pagemanager"),
	loader: require("./loader")
}

// Start Page Listener
new esix.pageManager().pageListen()

// Misc stuff
const $ = esix.modules.jquery;

$(document).ready(()=>{
	esix.loader.caption("Done!")
	setTimeout(()=>{
		esix.loader.hide()
	},1200)
})

console.debug(`[gui.js] esix global`,esix)