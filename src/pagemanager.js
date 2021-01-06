function UIDGen() {
	var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

class component {
	constructor() {
		this.$ = esix.modules.jquery;
	}
	function(thingClickedOn) {
		var shitToRun = null;
		switch(thingClickedOn.toLowerCase()) {
			case "search":
				shitToRun = esix.pages.search;
				break;
			case "home":
				shitToRun = esix.pages.home;
				break;
			case "settings":
				shitToRun = esix.pages.settings;
				break;
			case "debug":
				shitToRun = esix.pages.debug;
				break;
			case "download":
				shitToRun = esix.pages.download;
				break;
			case "gettingstarted":
				shitToRun = esix.pages.gettingstarted;
				break;
			default:
				return;
				break;
		}
		localStorage.currentTab = thingClickedOn.toLowerCase()
		var contentToGive = shitToRun.defaultPage()
		esix.content(contentToGive)
		setTimeout(()=>{
			var currentUID = UIDGen()
			localStorage.currentTabID = currentUID
			shitToRun.listen(currentUID)
		},500)
	}

	pageListen(){
		localStorage.currentTab = 'null';
		this.$("nav.main-navbar").click((me)=>{
			if (me.target.localName != 'a') return;
			var thingClickedOn = me.target.attributes.data.value;
			this.function(thingClickedOn);
		})
	}
}

module.exports = component;