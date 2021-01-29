const axios = require('axios');

module.exports = {
	defaultPage: () => {
		var keybindData = [];
		var t_keymap = JSON.parse(localStorage.keymap)
		var keymapLookup = {
			"previous": "Aciton: Previous",
			"next": "Action: Next",
			"actionup": "Post: Upvote",
			"actiondown": "Post: Downvote",
			"download": "Post: Download",
			"exit": "Action: Exit",
			"favorite": "Post: Favorite",
			"save": "Tag: Bookmark",
		}
		t_keymap = Object.entries(t_keymap);
		t_keymap.forEach((key)=>{
			var keymapString = key[0];
			var keymapDescription = keymapLookup[key[1]];
			if (keymapString.includes("key")) {
				keymapString = keymapString.replace("key","").toUpperCase()
			}
			else if (keymapString.includes("arrow")) {
				keymapString = keymapString.replace("arrow","")
				keymapString = `Arrow ${keymapString.charAt(0).toUpperCase() + keymapString.slice(1)}`
			}
			else {
				keymapString = keymapString.charAt(0).toUpperCase() + keymapString.slice(1)
			}
			var shitToPush = `
			<tr data="${key[1]}">
				<td><span>${keymapDescription}</span></td>
				<td>${keymapString}</td>
			</tr>
			`
			keybindData.push(shitToPush)
		})
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
			<div class="keyboardEditor">
				<h4>Edit Keybindings</h4>
				<div class="bindingContainer">
					<div class="tableContainer">
						<table>
							<thead>
								<tr>
									<th>Action</th>
									<th>Binding</th>
								</tr>
							</thead>
							${keybindData.join('\n')}
							<!--tr data="next">
								<td>
									<span>Action: Next</span>
								</td>
								<td>Left Arrow</td>
							</tr-->
						</table>
					</div>
					<ul class="selectedOptions">
						<li><a class="waves-effect waves-light btn" id="defaults">Reset All</a></li>
						<li><a class="waves-effect waves-light btn disabled" id="advanced">Advanced</a></li>
						<li><a class="waves-effect waves-light btn disabled" id="edit">Edit Binding</a></li>
						<li><a class="waves-effect waves-light btn disabled	" id="remove">Remove Binding</a></li>
					</ul>
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
				switch (error.response.status) {
					case 401:
						swat("Invalid Credentials", "The credentials you have given are invald or an error occurred.", "error")
						localStorage.credentialsValidated = false;
						return false;
					case 422:
						swat("Valid Credentials", "The credentials you provided are valid.", "success") // this is cap i need to add diff check
						localStorage.credentialsValidated = true;
						localStorage.auth_username = $("div.authSettings input#username[type=text]").val();
						localStorage.auth_key = $("div.authSettings input#key[type=password]").val();
						return true;
				}
			});
	},
	check: async () => {
		var $ = require("jquery");
		var swat = require("sweetalert");
		let username = localStorage.auth_username
		let key = localStorage.auth_key
		// sorry bro, this is the only way that i could get true results. 
		// i tried different things, but nothing worked.
		axios.post(`https://e621.net/posts/777/votes.json?score=0&login=${username}&api_key=${key}`, {})
			.then(function (response) {
				console.log(response.data);
			})
			.catch(function (error) {
				console.log(error);
				switch (error.response.status) {
					case 401:
						swat("Invalid Credentials", "The credentials you have given are invald or an error occurred.", "error")
						localStorage.credentialsValidated = false;
						return false;
					case 422:
						swat("Valid Credentials", "The credentials you provided are valid.", "success") // this is cap i need to add diff check
						localStorage.credentialsValidated = true;
						return true;
				}
			});
	},
	chip: (storagePopulated) => {
		var t_storage = [];
		if (storagePopulated) {
			t_storage = localStorage.search_blacklistedTags.split(",");
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
		localStorage.search_blacklistedTags = finalChips;
	},
	keybindOptionToggle: (g_keybind,g_enableButtons) => {
		var $ = esix.modules.jquery
		var t_keymap = Object.entries(JSON.parse(localStorage.keymap))
		t_keymap.forEach((fg_key)=>{
			if (fg_key[1] == g_keybind) return;
			$(`div.keyboardEditor div.bindingContainer tbody tr[data=${fg_key[1]}`).removeClass("active")
		})
		if (g_enableButtons == undefined) {
			$("div.keyboardEditor ul.selectedOptions a#advanced").toggleClass("disabled")
			$("div.keyboardEditor ul.selectedOptions a#edit").toggleClass("disabled")
			$("div.keyboardEditor ul.selectedOptions a#remove").toggleClass("disabled")
			return
		}
		if (g_enableButtons) {
			$("div.keyboardEditor ul.selectedOptions a#advanced").removeClass("disabled")
			$("div.keyboardEditor ul.selectedOptions a#edit").removeClass("disabled")
			$("div.keyboardEditor ul.selectedOptions a#remove").removeClass("disabled")
			return
		} else {
			$("div.keyboardEditor ul.selectedOptions a#advanced").addClass("disabled")
			$("div.keyboardEditor ul.selectedOptions a#edit").addClass("disabled")
			$("div.keyboardEditor ul.selectedOptions a#remove").addClass("disabled")
			return
		}
	},
	keybindOptionListen: () => {
		var $ = esix.modules.jquery
		$("div.keyboardEditor div.bindingContainer table tbody tr").click((me)=>{
			var keybindClicked = "";
			switch (me.target.localName) {
				case "span":
					keybindClicked = me.target.parentElement.parentElement.attributes.data.value;
					break;
				case "td":
					keybindClicked = me.target.parentElement.attributes.data.value;
					break;
				case "tr":
					keybindClicked = me.target.attributes.data.value;
					break;
			}
			console.debug(`[settings] Keybind for '${keybindClicked}' is active.`)
			if (localStorage.settings_activeKeybind != keybindClicked) {
				$(`div.keyboardEditor div.bindingContainer tbody tr[data=${localStorage.settings_activeKeybind}]`).toggleClass("active")
				module.exports.keybindOptionToggle(keybindClicked,true)
			} else {
				module.exports.keybindOptionToggle(keybindClicked,false)
			}
			localStorage.settings_activeKeybind = keybindClicked;
			$(`div.keyboardEditor div.bindingContainer tbody tr[data=${keybindClicked}`).toggleClass("active")
		})
	},
	listen: () => {
		var $ = require("jquery");
		var swat = require("sweetalert");
		console.debug("[settings.js] listen => called");
		module.exports.keybindOptionListen();
		// Login
		$("div.authSettings a#authSettings_verify").click(() => {
				console.log(localStorage.auth_username)
				console.log(localStorage.auth_key)
				if (localStorage.auth_username == undefined) {
					// No username
					swat("No Username", "No username was given so we can't log you in. Try again!", "error")
					return;
				}
			}),
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

		// Set Max Posts per Page
		$("div.apiSettings input#postsPerPage").keyup((me)=>{
			if (me.keyCode != 13) return;
			if ($("div.apiSettings input#postsPerPage").val() > 320) {
				localStorage.postsPerPage = 320
			} else {
				localStorage.postsPerPage = $("div.apiSettings input#postsPerPage").val()
			}
		})

		// Blacklisted Tags
		if (localStorage.search_blacklistedTags.split(",").length > 1 || localStorage.search_blacklistedTags != undefined || localStorage.search_blacklistedTags.length > 1) {
			var t_blackListedTags = localStorage.search_blacklistedTags;
			if (typeof localStorage.search_blacklistedTags == 'string') {
				t_blackListedTags = localStorage.search_blacklistedTags.split(",");
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
	},
	keylisten: (keyAction) => {
		// This will be populated when we start working on customization.
		return;
	}
}