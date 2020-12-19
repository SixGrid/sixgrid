module.exports = {
	content: [
		() => {
			// 1st
			return `
			<h3>Getting Started</h3>
			<p>Thanks for downloading ${esix.packageJSON.productName} ${esix.packageJSON.version}, it means quite a lot to the contributors. Since this program uses the e621 API make sure you have your API Key on hand, if you have no idea what that is or you don't know how to get in, then thats ok we can help you.
			<ul>
				<li>Go to <span id="outsidelink" data="https://e621.net">e621</span></li>
				<li>Login to your account</li>
				<li>Go to your <span id="outsidelink" data="https://e621.net/users/home">account settings</a>.</li>
				<li>Click on <code>Manage API access</code> then type your password in.</li>
				<li>Copy the "gibberish" text below the words <code>API Key</code></li>
				<li>Once you have copied it paste it somewhere like TextEdit (Mac) or Notepad (Windows)</li>
			</ul>
			`;
		},
		() => {
			// 2nd
			return `
			<h3>Logging into e621</h3>
			<p>Use the API key that you got from the previous tab and put it inside of the <code>API Key</code> Field and put your e621 username attached to that API Key into the <code>E621 Username</code> Field. When you have populated both of those fields go a head a click on the <code>Login</code> button.</p>

			<div class="login">
				<div class="row">
					<div class="input-field col s6">
						<input id="username" type="text">
						<label for="username">E621 Username</label>
					</div>
					<div class="input-field col s6">
						<input id="key" type="password">
						<label for="key">API Key</label>
					</div>
					<a class="waves-effect waves-light btn" id="loginToESIX">Login</a>
				</div>
			</div>
			`;
		},
		() => {
			// 3rd
			return `
			<h3>Option thing like download directory and post per page limit goes here. Most of this is a simpler settings tab</h3>
			`;
		},
		
	],
	listen: ()=>{
		var $ = esix.modules.jquery;
		var swal = require("sweetalert");
		var apiLib = esix.modules.api;
		console.debug("[gettingStarted.js] listen => called");
		$("div.steppercontent").html(module.exports.content[0]());
		$("nav.stepper#gettingStarted a.btn.right#next").click(()=>{
			// Set div.steppercontent contents of the 2nd content var (module.exports.content[1]);
			$("nav.stepper#gettingStarted a.breadcrumb#1").removeClass('active');
			$("nav.stepper#gettingStarted a.breadcrumb#2").addClass('active');
			$("div.steppercontent").html(module.exports.content[1]());
			console.debug("page 2 loaded")
			setTimeout(()=>{
				console.debug($("div.steppercontent div.login a#loginToESIX"))
			},1200)
			$("div.steppercontent div.login a#loginToESIX").click(()=>{
				if ($("div.steppercontent div.login input#username").val().length < 1) {
					// No username given
					swal("No Username", "No username was given so we can't log you in. Try again!", "error")
					return;
				}
				if ($("div.steppercontent div.login input#key").val().length < 1) {
					// No key was given
					swat("No key", "No key was given so we can't log you in. Try again!", "error")
					return;
				}

				// Key and Username was set, time to test if it actually works?!
				const options = {
					method: 'get',
					url: `https://e621.net/posts/1890798.json`,
					headers: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					data: {
						login: $("div.steppercontent div.login input#username").val(), 
						password_hash: $("div.steppercontent div.login input#key").val()
					},
				}
				require("axios")(options)
					.then(function (response) {
						console.debug("[gettingStarted] Recieved test data;",response)
						switch(response.status.toString()) {
							case '401':
								swal("Invalid Credentials", "The credentials you have given are invald or an error occurred.", "error")
								localStorage.credentialsValidated = false;
								break;
							case '200':
							case '422':
								swal("Valid Credentials", "The credentials you provided are valid.", "success") // this is cap i need to add diff check
								localStorage.credentialsValidated = true;
								localStorage.auth_username = $("div.steppercontent div.login input#username").val()
								localStorage.auth_key = $("div.steppercontent div.login input#key").val()
								localStorage.firstTime = false;
								esix.loadSixgrid();
								break;
							default:
								swal("Server Error", `Something failed on e621's server, try again later. Error Code ${response.status.toString()}`, "error")
								localStorage.credentialsValidated = false;
								break;
						}
					})
					.catch(function (error) {
						console.log(error);
						switch(error.response.status.toString()) {
							case '401':
								swal("Invalid Credentials", "The credentials you have given are invald or an error occurred.", "error")
								localStorage.credentialsValidated = false;

								break;
							case '422':
								swal("Valid Credentials", "The credentials you provided are valid.", "success") // this is cap i need to add diff check
								localStorage.credentialsValidated = true;
								localStorage.auth_username = $("div.steppercontent div.login input#username").val()
								localStorage.auth_key = $("div.steppercontent div.login input#key").val()
								localStorage.firstTime = false;
								esix.loadSixgrid();
								break;
							default:
								swal("Server Error", `Something failed on e621's server, try again later. Error Code ${error.response.status.toString()}`, "error")
								localStorage.credentialsValidated = false;

								break;
						}
					});
			})

			$("nav.stepper#gettingStarted a.btn.right#next").click(()=>{
				if (localStorage.credentialsValidated || localStorage.credentialsValidated != undefined) {
					$("nav.stepper#gettingStarted a.breadcrumb#2").removeClass('active');
					$("nav.stepper#gettingStarted a.breadcrumb#3").addClass('active');
					$("nav.stepper#gettingStarted a.btn.right#next").fadeOut('slow');
					$("div.steppercontent").html(module.exports.content[2]());

				} else {
					// Bring up msg saying that credentials are not validated.
					swal("YOU SHALL NOT PASS", "Your Credentials have not been validated, You cannot continue until they have been validated and saved.", "error");
				}
			})
		})
	},
	defaultPage: ()=>{
		return `
		<div class="container">
			<nav class="stepper" id="gettingStarted">
				<div class="nav-wrapper">
					<a href="#!" class="breadcrumb active" id="1">Overview</a>
					<a href="#!" class="breadcrumb" id="2">Credentials</a>
					<a href="#!" class="breadcrumb" id="3">Optional Settings</a>
					<a class="waves-effect waves-light btn right" id="next">next</a>
				</div>
			</nav>
			<div class="steppercontent">

			</div>
		</div>
		`;
	}
}