module.exports = {
	defaultPage: ()=>{
		return `
		<div class="container">
		<div class="setLocStoreVar input-field">
		<h4>Set your Username<h4>
		<input type="text" id="settings_applyuser-content_box">
	</div>
	<a class="waves-effect waves-light btn" id="debug_setStorageVariable_btn">set</a>
	</div>
</div>
				`;
	},
	listen: ()=>{
		var $ = require("jquery");
		console.debug("[settings.js] listen => called");
		$("#settings_applyuser-content_box").on('click',()=>{
			console.log("shit works")
			console.debug("Settings Button Clicked")
		})
	}
}