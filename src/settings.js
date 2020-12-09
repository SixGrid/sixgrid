const axios = require('axios');

module.exports = {
	defaultPage: () => {
		return `
		
		<div class="container">
			<h3>Settings</h3>
			<div class="authSettings">
				<h4 id="authSettings_header">Change Login Details</h4>
				<div class="row">
					<div class="input-field col s6">
						<input id="username" type="text">
						<label for="username">Username</label>
					</div>
					<div class="input-field col s6">
						<input id="key" type="password">
						<label for="key">API Key</label>
					</div>
					<a class="waves-effect waves-light btn" id="authSettings_change">Change & Verify Login Details</a>
					<a class="waves-effect waves-light btn" id="authSettings_verify">Verify Current Login Details</a>
				</div>
			</div>
			<hr>
			<div class="downloadSettings">
				<h4>Download Settings</h4>
				<div class="row">
					Current Download Location <code id="currentDownloadLocation">${localStorage.downloadLocation || 'No Set Download Location'}</code>
				</div>
				<div class="row">
					<div class="changeDownloadLocation">
						<input placeholder="${localStorage.downloadLocation|| 'No Set Download Location'}" id="changeDownloadLocation_textbox" type="text" class="validate">
						<a class="waves-effect waves-light btn" id="changeDownloadLoc_btn">Change Download Location</a>
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
				<div class="row"> 
					<div class="currentData tagBlacklist">
						<label for="chips">Tag Blacklist</label>
						<div class="chips chips-initial input-field">
							<!-- every div.chip is generated, everything else in this div is static. there will
									be some code detecting when enter is pressed (key 13) and it will add
									the new tag to an array. -->
							
							<span class="chipContain">

							</span>
							<input class="colorScheme input">
						</div>
					</div>
					<i>Note:</i> The e621 enforces the global blacklist (things that would be considered illegal in most countries), and you know what? If you bring up the removal of the global blacklist you're getting a beating.
				</div>
			</div>
			<hr>
		</div>

				`;
	},
	validate: async () => {
		var $ = require("jquery");
		var swat = require("sweetalert");
		let user = $("div.authSettings input#username[type=text]").val();
		let key = $("div.authSettings input#key[type=password]").val();
		axios.post(`https://e621.net/posts/777/votes.json?score=0&login=${user}&api_key=${key}`, {})
			.then(function (response) {
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
				if (error.response.status == 401) {
					swat("Invalid Credentials", "The credentials you have given are invald or an error occurred.", "error")
					localStorage.credentialsValidated = false;
					return false;
				} else if (error.response.status == 422) {
					// It works
					swat("Valid Credentials", "The credentials you provided are valid.", "success") // this is cap i need to add diff check
					localStorage.credentialsValidated = true;
					localStorage.auth_username = $("div.authSettings input#username[type=text]").val();
					localStorage.auth_key = $("div.authSettings input#key[type=password]").val();
					return true;
				}
				else{
					swat("Server Error", "Something failed on e621's server, try again later.", "error")
					localStorage.credentialsValidated = false;
					return false;
				}
			});
	},
	check: async () => {
		var swat = require("sweetalert");
		const options = {
			method: 'get',
			url: `https://e621.net/posts/1890798.json`,
			headers: {
				'content-type': 'application/x-www-form-urlencoded',
			},
			data: {
				login: localStorage.auth_username, password_hash: localStorage.auth_username
			},
		}
		axios(options)
			.then(function (response) {
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
				if (error.response.status == 401) {
					swat("Invalid Credentials", "The credentials you have given are invald or an error occurred.", "error")
					localStorage.credentialsValidated = false;
					return false;
				} else if (error.response.status == 422) {
					// It works
					swat("Valid Credentials", "The credentials you provided are valid.", "success") // this is cap i need to add diff check
					localStorage.credentialsValidated = true;
					return true;
				}
				else{
					swat("Server Error", "Something failed on e621's server, try again later.", "error")
					localStorage.credentialsValidated = false;
					return false;
				}
			});
	},
	chip: (storagePopulated) => {
		var t_storage = [];
		if (storagePopulated) {
			t_storage = localStorage.blacklistedTags.split(",");
		}
		module.exports.blacklistedTagsListen();
	},
	blacklistedTagsListen: () => {
		var $ = esix.modules.jquery;
		$("div.apiSettings div.tagBlacklist span.chipContain i.close").click(() => {
			setTimeout(() => {
				module.exports.updateBlacklistedChipsStorage();
			}, 50)
		})
		$("div.apiSettings div.tagBlacklist div.chips input").focusin(() => {
			$("div.apiSettings div.tagBlacklist div.chips").addClass('input-field-focus');
		})
		$("div.apiSettings div.tagBlacklist div.chips input").focusout(() => {
			$("div.apiSettings div.tagBlacklist div.chips").removeClass('input-field-focus');
		})
		$("div.apiSettings div.tagBlacklist div.chips input").keyup((me) => {
			if (me.which == 8 && $("div.apiSettings div.tagBlacklist div.chips input").val().length < 1) {
				// Remove previous tag
				var $chipContain = $("div.apiSettings div.tagBlacklist div.chips span.chipContain")
				console.debug(`[settings.js] Removed blacklistTag '${$chipContain[0].children[$chipContain[0].children.length - 1].children[0].innerHTML}'`)
				$chipContain[0].children[$chipContain[0].children.length - 1].remove()
			} else {
				if (me.which != 13) return;
				if ($("div.apiSettings div.tagBlacklist div.chips input").val().length < 1) return;
				$("div.apiSettings div.tagBlacklist span.chipContain").append(`
				<div class="chip">
					<span id="tag">${$("div.apiSettings div.tagBlacklist div.chips input").val().trim().split(' ').join("+")}</span>
					<i class="close material-icons">close</i>
				</div>
				`)
				console.debug(`[settings.js] Added blacklistTag '${$("div.apiSettings div.tagBlacklist div.chips input").val()}'`)
				$("div.apiSettings div.tagBlacklist div.chips input").val("");
			}
			module.exports.updateBlacklistedChipsStorage();
		})
	},
	updateBlacklistedChipsStorage: () => {
		//$("div.apiSettings div.tagBlacklist div.chips")
		var chipsInDIV = esix.modules.jquery("div.apiSettings div.tagBlacklist div.chips span.chipContain").children();
		var finalChips = []
		Array.from(chipsInDIV).forEach((chip) => {
			Array.from(chip.children).forEach((c) => {
				if (c.localName.toLowerCase() == 'span') {
					finalChips.push(c.innerHTML.trim())
				}
			})
		})
		localStorage.blacklistedTags = finalChips;
	},
	listen: () => {
		var $ = require("jquery");
		var swat = require("sweetalert");
		console.debug("[settings.js] listen => called");
		// Login
		$("div.authSettings a#authSettings_verify").click(() => {
			console.log(localStorage.auth_username)
			console.log(localStorage.auth_key)
			if (localStorage.auth_username == undefined) {
				// No username
				swat("No Username", "No username was given so we can't log you in. Try again!", "error")
				return;
			}}),
			$("div.authSettings a#authSettings_verify").click(() => {
				if (localStorage.auth_key == undefined) {
					// No username
					swat("No key", "No key was given so we can't log you in. Try again!", "error")
					return;
				}
			module.exports.check({
				username: localStorage.auth_username,
				key: localStorage.auth_key
			})
			}),
		$("div.authSettings a#authSettings_change").click(() => {
			if ($("div.authSettings input#username[type=text]").val().length < 1) {
				// No username
				swat("No Username", "No username was given so we can't log you in. Try again!", "error")
				return;
			}
			if ($("div.authSettings input#key[type=password]").val().length < 1) {
				// No key
				swat("No Key", "No key was given so we can't log you in. Try again!", "error")
				return;
			}
			module.exports.validate({
				username: $("div.authSettings input#username[type=text]").val(),
				key: $("div.authSettings input#key[type=password]").val()
			})
		})

		// Change Download Location
		$("div.changeDownloadLocation a#changeDownloadLoc_btn").click(() => {
			console.debug("[settings.js => eventClick] 'Change Download Location' button")
			if ($("div.downloadSettings input#changeDownloadLocation_textbox[type=text]").val() != localStorage.downloadLocation && localStorage.downloadLocation != undefined) {
				// new download location was typed in the textbox, or something change idk
			} else {
				// new download location was from the button click, that means they want a directory dialogue.

			}
			// Clear the input of the textbox. because we can?
			$("div.downloadSettings input#changeDownloadLocation_textbox[type=text]").val("")
		})

		// Blacklisted Tags
		if (localStorage.blacklistedTags.split(",").length > 1 || localStorage.blacklistedTags != undefined || localStorage.blacklistedTags.length > 1) {
			var t_blackListedTags = localStorage.blacklistedTags;
			if (typeof localStorage.blacklistedTags == 'string') {
				t_blackListedTags = localStorage.blacklistedTags.split(",");
			}
			t_blackListedTags.forEach((tag) => {
				if (tag.length < 1) return;
				$("div.apiSettings div.tagBlacklist div.chips span.chipContain").append(`
					<div class="chip">
						<span id="tag">${tag}</span>
						<i class="close material-icons">close</i>
					</div>
				`)
			})
			module.exports.chip(true);
		} else {
			module.exports.chip(false);
		}
	}
}