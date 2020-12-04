class component {
	constructor() {
		this.$ = esix.modules.jquery;
	}

	pageListen(){
		this.$("nav.main-navbar").click((me)=>{
			if (me.target.localName != 'a') return;
			var thingClickedOn = me.target.attributes.data.value;
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
				default:
					return;
					break;
			}
			localStorage.currentTab = thingClickedOn.toLowerCase()
			var contentToGive = shitToRun.defaultPage()
			esix.content(contentToGive)
			setTimeout(()=>{
				shitToRun.listen()
			},500)
		})
	}
}

module.exports = component;