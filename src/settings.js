module.exports = {
	defaultPage: ()=>{
		return `
		<div class="container">
				<h1>Settings</h1>
				<a class="waves-effect waves-light btn-large" id="settings_applybtn">Test</a>
		</div>
				`;
	},
	listen: ()=>{
		var $ = require("jquery");
		console.debug("[settings.js] listen => called");
		$("#settings_applybtn").on('click',()=>{
			console.log("shit works")
			console.debug("Settings Button Clicked")
		})
	}
}