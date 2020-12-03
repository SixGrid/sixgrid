class component {
	constructor(){
		this.$ = esix.modules.jquery;
	}

	listen() {
		this.$("#settings_applybtn").on('click',()=>{
			console.debug("Settings Button Clicked")
		})
	}
	
	defaultPage() {
		return `
<div class="container">
		<h1>Settings</h1>
		<a class="waves-effect waves-light btn-large" id="settings_applybtn">Test</a>
</div>
		`;
	}
}


module.exports = component;