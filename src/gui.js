global.esix = {
	modules: {
		esixapi: require("esix-api"),
		jquery: require("jquery")
	}
}

const $ = esix.modules.jquery;

$(document).ready(()=>{
	$("#loadingStatus").html("Done!")
	setTimeout(()=>{
		$("div.preloader").fadeOut("fast")
		$("#loadingStatus").html("<!-- -->")
	},1200)
})

require("./listener")

console.debug(`[gui.js] esix global`,esix)