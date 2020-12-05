module.exports = {
	defaultPage: ()=>{
		return `
		
		<div class="container">
			<h3>Settings</h3>
			<div class="authSettings">
				<h4 id="authSettings_header">Change Login Details</h4>
				<div class="row">
					<div class="input-field col s6">
						<input id="first_name" type="text">
						<label for="first_name">Username</label>
					</div>
					<div class="input-field col s6">
						<input id="last_name" type="password">
						<label for="last_name">API Key</label>
					</div>
					<a class="waves-effect waves-light btn" id="authSettings_change">Change & Verify Login Details</a>
					<a class="waves-effect waves-light btn" id="authSettings_verify">Verify Current Login Details</a>
				</div>
			</div>
			<hr>
			<div class="downloadSettings">
				<h4>Download Settings</h4>
				<div class="row">
					Current Download Location <code id="currentDownloadLocation">${localStorage.downloadLocation-string || 'No Set Download Location'}</code>
				</div>
				<div class="row">
					<div class="changeDownloadLocation">
						<a class="waves-effect waves-light btn" id="changeDownloadLoc_btn">Change Download Location</a><br>
						<input placeholder="${localStroage.downloadLocation-string || 'No Set Download Location'}" id="changeDownloadLocation_textbox" type="text" class="validate">
					</div>
				</div>
			</div>
			<hr>
			<div class="apiSettings">
				<h4>API Settings</h4>
				<div class="row">
					<label for="postsPerPage">Posts per Page</label>
					<input placeholder="Default: 90; Current: ${localStorage.postsPerPage || '90'}" id="postsPerPage" type="number">
				</div>
				<a class="waves-effect waves-light btn" id="save">save</a>
			</div>
			<hr>
		</div>

				`;
	},
	validate: async (credentials)=>{
		var $ = require("jquery");
		var swat = require("sweetalert");
		var testDetails = new api(credentials)
		var output = await testDetails._req("posts.json?tags=esix&limit=1")
		if (output.posts == undefined) {
			// It does not work
			swat("Invalid Credentials","The credentials you have given are invald or an error occurred.","error")
			localStorage.credentialsValidated = false;
			return false;
		} else {
			// It works
			swat("Valid Credentials","The credentials you gave works and are now stored.","success")
			localStorage.credentialsValidated = true;
			localStorage.auth_username = $("div.authSettings imput#username[type=text]").val();
			localStorage.auth_key = $("div.authSettings input#key[type=password]").val();
			return true;
		}
	},
	listen: ()=>{
		var $ = require("jquery");
		var swat = require("sweetalert");
		console.debug("[settings.js] listen => called");
		// Login
		$("div.authSettings a#authSettings_change").click(()=>{
			if ($("div.authSettings imput#username[type=text]").val().length < 1) {
				// No username
				swat("No Username","No username was given so we can't log you in. Try again!","error")
				return;
			}
			if ($("div.authSettings input#key[type=password]").val().length < 1) {
				// No key
				swat("No Key","No key was given so we can't log you in. Try again!","error")
				return;
			}
			module.exports.validate({username:$("div.authSettings imput#username[type=text]").val(),key:$("div.authSettings input#key[type=password]").val()})
		})
	}
}