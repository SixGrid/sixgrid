module.exports = {
	defaultPage: ()=>{
		
		if (localStorage.credentialsValidated == 'true') {
			var savedTags = "<!-- -->";
			if (localStorage.savedTags != undefined && localStorage.savedTags.split(',')[0] != undefined) {
				var tempChip = ``;
				var t_savedPosts = localStorage.savedTags.split(',');
				t_savedPosts.forEach((p)=>{
					tempChip=`${tempChip}
					<div class="chip" data="${p}">
						<span>${p}</span>
						<i class="close material-icons">close</i>
					</div>`
				})
				var savedTags = `
				<div class="chips">
					${tempChip}
				</div>
				`
			}
			return `
				<div class="searchBar">
					<ul class="searchBar-list">
						<li class="mainSearch">
							<nav class="smallSearch">
								<div class="nav-wrapper">
									<div class="input-field">
										<input id="search" type="search">
										<label class="label-icon" for="search" id="searchButton"><i class="material-icons">search</i></label>
										<i class="material-icons">close</i>
									</div>
								</div>
							</nav>
						</li>
						<li class="searchOptions">
							<a class="waves-effect waves-light btn-small" id="saveTag">Save Tag</a>
							<a class="waves-effect waves-light btn-small" id="options">Options</a>
						</li>
					</ul>
					${savedTags}
				</div>
				<div class="searchResults">

				</div>
				<div class="pageControl">
					<ul class="pagination">
						<li class="waves-effect"><a id="prev_page"><i class="material-icons">chevron_left</i></a></li>
						<li class="active"><a id="pageCount">1</a></li>
						<li class="waves-effect"><a id="next_page"><i class="material-icons">chevron_right</i></a></li>
					</ul>
				</div>
			`;
		} else if(localStorage.credentialsValidated == 'false') {
			return `
			<div class="container">
				<h1>Login to e621</h1>
				<p>
					You have not validated your credentials or you have not set them, please go over to the settings tab to set them or read Getting Started for more information. You will not be allowed to  the search function until you have logged in/authorized your credentials.
				</p>
			</div>`;
		}
	},
	generateSavedTagsChips: ()=> {
		var $ = esix.modules.jquery;
		if (localStorage.savedTags != undefined && localStorage.savedTags.split(',')[0] != undefined) {
			var tempChip = ``;
			var t_savedPosts = localStorage.savedTags.split(',');
			t_savedPosts.forEach((p)=>{
				tempChip=`${tempChip}
				<div class="chip" data="${p}">
					<span>${p}</span>
					<i class="close material-icons">close</i>
				</div>`
			})
			var savedTags = `
			<div class="chips">
				${tempChip}
			</div>
			`;
			console.debug(`[search] Updated chips with content of ${tempChip} and JSON data of `,t_savedPosts)
			$("div.searchBar div.chips").html(tempChip)
		}
	},
	generateCard: (p) => {
		return `
		<li class="post">
			<div class="card small">
				<img onclick="esix.pages.search.fullScreen('${Buffer.from(JSON.stringify(p)).toString("base64")}')" src="${p.preview.url || p.sample.url || p.file.url}" onerror="this.src='https://cdn.jyles.club/missing-post.png'">
				<ul class="post-info">
					<li class="score_total">
						S${p.score.total}
					</li>
					<li class="fav_count">
						❤️${p.fav_count}
					</li>
					<li class="rating ${p.rating}-rating">
						${p.rating.toUpperCase()}
					</li>
					<li class="comment_count">
						C${p.comment_count}
					</li>
				</ul>
			</div>
		</li>
		`;
	},
	filterPosts: (posts) => {
		var filtercount = 0;
		var returnedPosts = {posts:[]}
		posts.posts.forEach((post)=>{
			if ((post.file.url == null || post.file.url.length < 1) && (post.sample.url == null || post.sample.url.length < 1) && (post.preview.url == null || post.preview.url.length < 1)) {
				return;
			} else {
				var allow = true;
				Object.entries(post.tags).forEach((tagArray)=>{
					tagArray[1].forEach((tag)=>{
						localStorage.blacklistedTags.split(",").forEach((btag)=>{
							if (tag.toLowerCase() == btag.toLowerCase()) {
								allow = false;
								filtercount++;
							}
						})
					})
				})
				if (allow) {
					returnedPosts.posts.push(post);
				}
			}
		})
		console.debug(`[search.js] Filteded out '${filtercount}' posts.`);
		return returnedPosts;
	},
	generatePageHTML: (posts) => {
		var htmlPostArray = [];
		posts.posts.forEach((post)=>{
			if (post.file.url.length < 1 && post.sample.url.length < 1 &&post.preview.url.length < 1) {
				return;
			} else {
				htmlPostArray.push(module.exports.generateCard(post))
				esix.searchStorage.currentPosts.push(post)
			}
		})
		localStorage.currentPage++;
		localStorage.totalPages++;
		$("div.pageControl #pageCount").html(localStorage.totalPages);
		return `
		<div class="container">
			<div id="pageheader page${localStorage.currentPage}"></div>
			<ul class="cardContainer">
				${htmlPostArray.join('\n')}
			</ul>
		</div>`;
	},
	generateSearchResults: async (t_tags) => {
		var api = esix.api;
		var $ = esix.modules.jquery;
		$("div.pageControl").fadeIn("fast");
		console.debug(`[search.js] Tags given`,t_tags);
		var oposts = await api.getPostsByTag({tags:[t_tags],limit:localStorage.postsPerPage || '90'});
		var returnedPosts = module.exports.filterPosts(oposts);
		
		localStorage.currentTags = t_tags;
		console.debug(`[search.js] Recieved ${returnedPosts.posts.length} posts`,returnedPosts);
		esix.searchStorage.currentPosts = [];
		
		localStorage.currentPage = 0;
		localStorage.totalPages = 0;
		$(".searchResults").html(module.exports.generatePageHTML(returnedPosts))
		$("div.searchBar li.searchOptions a#saveTag").click(()=>{
			// Save current tag, if there are none then show message saying there are no tags selected/searched`
			var tempTags = []
			if (localStorage.savedTags != undefined && localStorage.savedTags.length > 1){
				tempTags = localStorage.savedTags.split(',');
			}
			if (!tempTags.includes(t_tags)) {
				tempTags.push(t_tags)
				esix.notification('info','Tags Saved')
			} else {
				esix.notification('warn','Tags Already Exists')
			}
			console.debug(`[search] Saved ${tempTags.length} tags.`,tempTags)
			localStorage.savedTags = tempTags.join(',');
			module.exports.generateSavedTagsChips();
		});
		$("div.searchBar li.searchOptions a#options").click(()=>{
			// Toggle display of options dropdown menu.
			$("div.searchSettings").addClass("show");
		});
		$("div.pageControl a#prev_page").click(()=>{
			// scroll to the top of the previous page
				var pageToGoto = localStorage.currentPage - 1;
			if ($(`div.searchResults div.page${pageToGoto}`).length) {
				// Scroll to page
				$([document.documentElement, document.body]).animate({
					scrollTop: $(`div.searchResults div.page${localStorage.currentPage}`).offset().top
				}, 2000);
			}
		})
		$("div.pageControl a#next_page").click(async()=>{
			// Append contents of next page to "searchResults"
				var pageToGoto = parseInt(localStorage.currentPage) + 1;
				console.log(pageToGoto, localStorage.currentPage, localStorage.currentPostIndex)
			if ($(`div.searchResults div.page${pageToGoto}`).length) {
				// Scroll to page
				$([document.documentElement, document.body]).animate({
					scrollTop: $(`div.searchResults div.page${pageToGoto}`).offset().top
				}, 2000);
			} else {
				// Append then scroll to top of new page.
				var newPage = await esix.api.getPostsByTag({tags:[t_tags],limit:localStorage.postsPerPage || '90',page:pageToGoto});
				console.log(newPage)
				$("div.searchResults").append(module.exports.generatePageHTML(newPage));
				$("div.pageControl #pageCount").html(localStorage.totalPages);
			}
		})
	},
	listen: ()=>{
		if (!localStorage.credentialsValidated) return;
		console.debug("[settings.js] listen => called");
		var $ = esix.modules.jquery;
		console.debug(esix)
		$("div.pageControl").fadeOut("fast");
		$("div.input-field input#search[type=search]").keyup(async (me)=>{
			if (me.which != 13) return;
			module.exports.generateSearchResults($("div.input-field input#search[type=search]").val().split(' ').join("+"))
		});
		$("div.searchBar div.chips div.chip span").click((me)=>{
			$("div.input-field input#search[type=search]").val(me.target.parentElement.attributes.data.value.split("+").join(" "))
			module.exports.generateSearchResults(me.target.parentElement.attributes.data.value)
		})
		$("div.searchBar div.chips div.chip i.close").click((me)=>{
			var tagtoRemove = me.target.parentElement.attributes.data.value;
			console.debug(`[search] Removed Saved Tag '${tagtoRemove}'`)
			var t_savedTags = localStorage.savedTags.split(',').filter((el)=>{return el != tagtoRemove});
			console.debug(t_savedTags)
			localStorage.savedTags = t_savedTags.join(',');
			esix.notification('info',`Removed tag '${tagtoRemove}'`)
			module.exports.generateSavedTagsChips();
		})
	},
	fullScreen: (imgDATA)=>{
		var postData = imgDATA;
		if (typeof imgDATA == 'string') {
			postData = JSON.parse(atob(imgDATA));
			console.debug(`[search.js] Decoded image ${postData.id} post data`,postData);
		}
		var $ = esix.modules.jquery;
		var esixPostIndex = 0;
		var esixPostLimit = esix.searchStorage.currentPosts.length;
		var currentPostIndex = 0;
		localStorage.search_isFullscreen = true;
		esix.searchStorage.currentPosts.forEach((p)=>{
			if (p.id == postData.id) {
				currentPostIndex = esixPostIndex;
			}
			esixPostIndex++;
		})
		var previousPostButton = `
			<i class="material-icons">navigate_before</i>
		`;
		var nextPostButton = `
			<i class="material-icons">navigate_next</i>
		`;
		if (currentPostIndex == 0) {
			// No Back Button, we are at the begining.
			previousPostButton = `<!--${previousPostButton}-->`;
		}
		if (currentPostIndex == esixPostLimit) {
			// No Forward Button, we are at the end
			nextPostButton = `<!--${nextPostButton}-->`;
		}
		var postTable = `
		<table class="post-fullscreen">
			<tr class="post">
				<td class="post-previous">
					${previousPostButton}
				</td>
				<td class="post-image">
					<img src="${postData.file.url || postData.sample.url || postData.preview.url}" onerror="this.src='https://cdn.jyles.club/missing-post.png'">
				</td>
				<td class="post-next">
					${nextPostButton}
				</td>
			</tr>
		</table>
		`;
		var dc = new Date(Date.parse(postData.created_at));
		var dm = new Date(Date.parse(postData.updated_at))
		var dateCreated = `${dc.toDateString()} ${dm.getUTCHours()}:${dc.getUTCMinutes()};${dc.getUTCSeconds()}`;
		var dateMod = `${dm.toDateString()} ${dm.getUTCHours()}:${dm.getUTCMinutes()};${dm.getUTCSeconds()}`;
		
		var CreatedAt = `<li><strong>Created at</strong> ${dateCreated}</li>`
		var UpdatedAt = `<li><strong>Updated at</strong> ${dateMod}</li>`
		if (dateMod == dateCreated) {
			UpdatedAt = " ";
		}
		var postInfo = `
		<div class="post-info">
			<table class="postinfotable">
				<tr>
					<td class="left">
						<ul>
							${CreatedAt}
							${UpdatedAt}
							<span id="outsidelink" data="https://e621.net/posts/${postData.id}">View on e621</span>
						</ul>
					</td>
					<td class="middle">
						<i class="material-icons window-control" id="close-window">close</i>
					</td>
					<td class="right">
						<i class="material-icons post-control" id="upvote" data="${postData.id}">arrow_upward</i>
						<span class="post-control" id="postscore">${postData.score.total}</span>
						<i class="material-icons post-control" id="downvote" data="${postData.id}">arrow_downward</i>
						<i class="material-icons post-control favourite-${postData.is_favorited}" id="favorite" data="${postData.id}">star_border</i>
						<i class="material-icons post-control" id="download" data="${postData.id}">file_download</i>
					</td>
				</tr>
			</table>
		</div>
		`;

		var finalHTML = `
		<div class="fullscreenResult">
				${postTable}
				${postInfo}
		</div>
		`;
		if ($("div.fullscreenResult").length) {
			$("div.fullscreenResult").html(`${postTable}${postInfo}`)
		} else {
			$("div.pageContent").append(finalHTML)
		}

		$("div.post-info i.window-control").click(()=>{
			module.exports.keylisten_fullscreen('exit')
		})

		$('span#outsidelink').on('click', (event) => {
			event.preventDefault();
			let link = event.target.attributes.data.value;
			require("electron").shell.openExternal(link);
		});
		if (currentPostIndex == 0) {
			// No Back Button, we are at the begining.
			localStorage.nextPostID = esix.searchStorage.currentPosts[currentPostIndex+1].id
			localStorage.nextPostIndex = currentPostIndex+1;
			localStorage.previousPostID = null
			localStorage.previousPostIndex = null;
		}
		if (currentPostIndex == esixPostLimit) {
			// No Forward Button, we are at the end
			localStorage.nextPostID = null;
			localStorage.nextPostIndex = null;
			localStorage.previousPostID = esix.searchStorage.currentPosts[currentPostIndex-1].id;
			localStorage.previousPostIndex = currentPostIndex-1;
		}
		if (currentPostIndex != 0 && currentPostIndex != esixPostLimit) {
			localStorage.nextPostID = esix.searchStorage.currentPosts[currentPostIndex+1].id
			localStorage.nextPostIndex = currentPostIndex+1;
			localStorage.previousPostID = esix.searchStorage.currentPosts[currentPostIndex-1].id;
			localStorage.previousPostIndex = currentPostIndex-1;
		}
		localStorage.currentPostIndex = currentPostIndex;
		$("div.fullscreenResult table.post-fullscreen td.post-next").click(()=>{
			module.exports.keylisten_fullscreen('next')
			return;
		})
		$("div.fullscreenResult table.post-fullscreen td.post-previous").click(()=>{
			module.exports.keylisten_fullscreen('previous')
			return;
		})
		$("i.post-control#download").click(()=>{
			module.exports.keylisten_fullscreen('download')
		})
		// Favorite
		$("i.post-control#favorite.favourite-false").click(()=>{
			var postID = esix.searchStorage.currentPosts[currentPostIndex].id;
			esix.searchStorage.currentPosts[currentPostIndex].is_favorited = true;
			esix.api._req(`favorites.json?post_id=${postID}`,'post')
		})
		$("i.post-control#favorite.favourite-true").click(()=>{
			var postID = esix.searchStorage.currentPosts[currentPostIndex].id;
			esix.searchStorage.currentPosts[currentPostIndex].is_favorited = false;
			esix.api._req(`favorites/${postID}.json`,'delete')
		})
		// Upvote
		$("i.post-control#upvote").click(()=>{
			module.exports.keylisten_fullscreen('actionup');
		})
		// Downvote
		$("i.post-control#downvote").click(()=>{
			module.exports.keylisten_fullscreen('actiondown');
		})
		return;
	},
	vote: (direction) => {
		switch(direction) {
			case "up":
				var postID = esix.searchStorage.currentPosts[localStorage.currentPostIndex].id;
				esix.searchStorage.currentPosts[localStorage.currentPostIndex].score.total++;
				esix.searchStorage.currentPosts[localStorage.currentPostIndex].score.up++;
				esix.api._req(`posts/${postID}/votes.json?no_unvote=true&score=1`,'post')
				break;
			case "down":
				var postID = esix.searchStorage.currentPosts[localStorage.currentPostIndex].id;
				esix.searchStorage.currentPosts[localStorage.currentPostIndex].score.total = `${esix.searchStorage.currentPosts[currentPostIndex].score.total-1}`;
				esix.searchStorage.currentPosts[localStorage.currentPostIndex].score.down = `${esix.searchStorage.currentPosts[currentPostIndex].score.down-1}`;
				esix.api._req(`posts/${postID}/votes.json?no_unvote=true&score=-1`,'post')
				break;
		}
	},
	keylisten: (keyAction) => {
		if (localStorage.search_isFullscreen == 'true') {
			module.exports.keylisten_fullscreen(keyAction);
		}
		return;
	},
	keylisten_fullscreen: (keyAction)=> {
		if (localStorage.search_isFullscreen == 'false') return;
		var $ = esix.modules.jquery;
		switch(keyAction.toLowerCase()) {
			case "previous": 
				module.exports.fullScreen(esix.searchStorage.currentPosts[localStorage.previousPostIndex]);
				break;
			case "next":
				module.exports.fullScreen(esix.searchStorage.currentPosts[localStorage.nextPostIndex]);
				break;
			case "actionup":
				module.exports.vote('up')
				break;
			case "actiondown":
				module.exports.vote('down')
				break;
			case "download":
				var post = esix.searchStorage.currentPosts[localStorage.currentPostIndex];
				esix.downloadPost(post);
				break;
			case "exit":
				localStorage.search_isFullscreen = 'false';
				$("div.fullscreenResult").fadeOut('fast')
				$("div.fullscreenResult").remove()
				break;
		}
	}
}