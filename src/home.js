module.exports = {
	listen: ()=>{
		var $ = esix.modules.jquery;
		console.debug("[settings.js] listen => called");
	},
	defaultPage: ()=>{
		return `
		<div class="container">
				<h1>Welcome to Sixgrid</h1>
				<p>
					This will probably be replaced with the feed.
				</p>
		</div>`;
	}
}