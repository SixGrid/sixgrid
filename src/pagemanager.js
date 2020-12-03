class component {
	constructor() {
		this.$ = esix.modules.jquery;
	}

	pageListen(){
		this.$("nav.main-navbar").click((me)=>{
			if (me.target.localName != 'a') return;
			var thingClickedOn = me.target.attributes.data.value;
			var shitToRun = null;
			switch(thingClickedOn) {
				case "search":
					shitToRun = new esix.functions.search();
					break;
				case "home":
					shitToRun = new esix.functions.home();
					break;
				case "settings":
					shitToRun = new esix.functions.settings();
					break;
				default:
					return;
					break;
			}
			var contentToGive = shitToRun.defaultPage()
			esix.content(contentToGive)
			shitToRun.listen()
		})
	}

	pageSelect(g_page){
		switch(g_page.toLowerCase()){

		}
	}
}

module.exports = component;