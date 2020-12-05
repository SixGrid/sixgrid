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
			<h3>Details on how to login with the exact same logic seen in settings.js</h3>
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
		console.debug("[gettingStarted.js] listen => called");
		$("div.steppercontent").html(module.exports.content[0]());
		$("nav.stepper#gettingStarted a.btn.right#next").click(()=>{
			// Set div.steppercontent contents of the 2nd content var (module.exports.content[1]);
			$("nav.stepper#gettingStarted a.breadcrumb#1").removeClass('active');
			$("nav.stepper#gettingStarted a.breadcrumb#2").addClass('active');
			$("div.steppercontent").html(module.exports.content[1]());
			$("nav.stepper#gettingStarted a.btn.right#next").click(()=>{
				$("nav.stepper#gettingStarted a.breadcrumb#2").removeClass('active');
				$("nav.stepper#gettingStarted a.breadcrumb#3").addClass('active');
				$("nav.stepper#gettingStarted a.btn.right#next").fadeOut('slow');
				$("div.steppercontent").html(module.exports.content[2]());
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