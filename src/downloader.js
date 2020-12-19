module.exports = {
	defaultPage: ()=>{
		return `
		<div class="container">
				<h1>Getting Started</h1>
				<p>
					Information on how to login and use the app would go here.
				</p>
		</div>`;
	},
	listen: ()=>{
		var $ = esix.modules.jquery;
		console.debug("[downloader] listen => called");
	}
}