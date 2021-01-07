module.exports = {
	show: (content) => {
		console.debug("[loader] Shown");
		$("#loadingStatus").html(content || "<!-- -->")
		$("div.preloader").fadeIn("fast")
		$("div.preloader").css("display","inital");
	},
	hide: () => {
		console.debug("[loader] Hidden");
		$("div.preloader").fadeOut("fast")
		$("#loadingStatus").html("<!-- -->")
		$("div.preloader").css("display","none");
	},
	caption: (content,contentHeader) => {
		console.debug(`[loader] Caption Changed to '${content}' with header of '${contentHeader || "Loading"}'`);
		$("#loadingStatus").html(content || "<!-- -->")
		$("div.preloader div.container h4").html(contentHeader || "Loading");
	}
}