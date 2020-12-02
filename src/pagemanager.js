class component {
	constructor() {
		this.$ = esix.modules.jquery;
	}

	pageListen(){
		this.$("nav.main-navbar").click((me)=>{
			if (me.target.localName != 'a') return;
			var thingClickedOn = me.target.attributes.data.value;

			switch(thingClickedOn) {
				case "search":
					var content = new esix.functions.search().defaultPage()
					this.$("div.pageContent").html(content)
					break;
				case "home":
					var content = new esix.functions.home().defaultPage()
					this.$("div.pageContent").html(content)
					break;
				case "settings":
					var content = new esix.functions.settings().defaultPage()
					this.$("div.pageContent").html(content)
					break;
				default:
					return;
					break;
			}
		})
	}

	pageSelect(g_page){
		switch(g_page.toLowerCase()){

		}
	}
}

module.exports = component;