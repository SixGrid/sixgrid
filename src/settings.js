class component {
	constructor(){
		this.$ = esix.modules.jquery;
	}
	
	defaultPage() {
		return `
<div class="container">
		<h1>Settings</h1>
</div>
		`;
	}
}


module.exports = component;