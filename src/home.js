class component {
	constructor(){
		this.$ = esix.modules.jquery;
	}
	
	defaultPage() {
		return `
<div class="container">
		<h1>Getting Started</h1>
		<p>
			Information on how to login and use the app would go here.
		</p>
</div>
		`;
	}

	listen() {
		
	}
}


module.exports = component;