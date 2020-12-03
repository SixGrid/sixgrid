global.esix = {
	modules: {
		api: require("esix-api"),
		jquery: require("jquery")
	},
	functions: {
		search: require("./search"),
		home: require("./home"),
		settings: require("./settings")
	},
	pageManager: require("./pagemanager"),
	loader: require("./loader"),
	content: (g_content) => {
		esix.modules.jquery('div.pageContent').animate({'opacity': 0}, 30, function () {
			$(this).html(g_content);
		}).animate({'opacity': 1}, 100);
		return;
	}
}

// Misc stuff
const $ = esix.modules.jquery;

$(document).ready(()=>{
	esix.loader.caption("Done!")
	setTimeout(()=>{
		esix.loader.hide()
	},1200)
})

console.debug(`[gui.js] esix global`,esix)

// Start Page Listener
new esix.pageManager().pageListen()