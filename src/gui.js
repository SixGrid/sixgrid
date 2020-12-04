global.esix = {
	modules: {
		api: require("esix-api"),
		jquery: require("jquery")
	},
	pages: {
		search: require("./search"),
		home: require("./home"),
		settings: require("./settings"),
		debug: require("./debugpage"),
	},
	pageManager: require("./pagemanager"),
	loader: require("./loader"),
	packageJSON: require("./../package.json"),
	content: (g_content) => {
		esix.modules.jquery('div.pageContent').animate({'opacity': 0}, 100, function () {
			$(this).html(g_content);
		}).animate({'opacity': 1}, 200);
		return;
	},
	searchStorage: { }
}

// Misc stuff
const $ = esix.modules.jquery;
$("a#branding").html(esix.packageJSON.productName)
$(document).ready(()=>{
	esix.loader.caption("Done!")
	setTimeout(()=>{
		esix.loader.hide()
	},1200)
})//rating:safe femboy outside

if (localStorage.debugMode) {
	$("#navbarLinks").append(`<li><a data="debug">Debug Menu</a></li>`)
}

console.debug(`[gui.js] esix global`,esix)

// Start Page Listener
new esix.pageManager().pageListen()