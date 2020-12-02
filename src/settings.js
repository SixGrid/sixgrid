class component {
	constructor(){
		this.$ = esix.modules.jquery;
	}
	
	defaultPage() {
		return `
<div class="container">
		<h1>Settings</h1>
		<a class="waves-effect waves-light btn-large" id="testing">Test</a>
</div>

		`;
	}
}


module.exports = component;