module.exports = {
	show: (content) => {
		$("#loadingStatus").html(content || "<!-- -->")
		$("div.preloader").fadeIn("fast")
	},
	hide: () => {
		$("div.preloader").fadeOut("fast")
		$("#loadingStatus").html("<!-- -->")
	},
	caption: (content) => {
		$("#loadingStatus").html(content || "<!-- -->")
	}
}