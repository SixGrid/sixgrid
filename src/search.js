function UIDGen() {
	var length = 6
	var charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
	var retVal = "";
	for (var i = 0, n = charset.length; i < length; ++i) {
		retVal += charset.charAt(Math.floor(Math.random() * n));
	}
	return retVal;
}

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
						<li class="searchButtons">
							<a class="waves-effect waves-light btn-small" id="saveTag">Save Tag</a>
							<a class="waves-effect waves-light btn-small" id="options">Options</a>
						</li>
					</ul>
					${savedTags}
				</div>
				<div class="searchResults">

				</div>
				<div class="searchOptionsWindow">
					<div class="content">
						
						<label>Rating Filter</label>
						<select class="browser-default" id="rating">
							<option value="" disabled selected>Rating Filter</option>
							<option value="none" selected>No Rating Filter</option>
							<option value="s">Safe</option>
							<option value="q">Questionable</option>
							<option value="e">Explicit</option>
						</select>
						<hr>
						<label>Page Preload</label>
						<input id="preloadPageCount" type="number" placeholder="Page Count"></input>
							<a class="waves-effect waves-light btn-small" id="preloadPageButton">Preload Pages</a>
						<hr>
						<input id="tempTagBlacklist" type="text" placeholder="Temporary Tag Blacklist"></input>
						<i class="close material-icons">close</i>
					</div>
				</div>
				<div class="pageControl" style="display: none;">
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
			if ($("div.searchBar div.chips").length == 0) {
				// Chips do not exist
				$("div.searchBar").append(`<div class="chips"> </div>`)
			}
			$("div.searchBar div.chips").html(tempChip)
		}
	},
	generateCard: (p) => {
		return `
		<li class="post">
			<div class="card small">
				<img onclick="esix.pages.search.fullScreen('${p.id}')" src="${p.preview.url || p.sample.url || p.file.url}" onerror="this.src='https://cdn.jyles.club/missing-post.png'">
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
		if (localStorage.blacklistedTags == undefined) {
			localStorage.blacklistedTags = '';
		}
		var filtercount = 0;
		var returnedPosts = {posts:[]}
		posts.posts.forEach((post)=>{
			// Force the file URL
			if (localStorage.search_bypassGlobalFilter == "true") {
				if (post.file.ext == "swf") {
					post.file.old_url = post.file.url;
					post.file.url = "https://cdn.jyles.club/flash_not_supported.png";
					post.preview.url = "https://cdn.jyles.club/flash_not_supported.png";
					post.sample.url = "https://cdn.jyles.club/flash_not_supported.png";
				}
				if (post.file.md5 != undefined && post.file.ext != undefined && post.file.ext != "swf") {
					post.file.url = 'https://static1.e621.net/data/' + post.file.md5.slice(0, 2)  + '/' + post.file.md5.slice(2, 4) + '/' + post.file.md5 + '.' + post.file.ext;
					if (post.sample.has) {
						post.sample.url = 'https://static1.e621.net/data/sample/' + post.file.md5.slice(0, 2)  + '/' + post.file.md5.slice(2, 4) + '/' + post.file.md5 + '.jpg';
					}
					switch (post.file.ext) {
						case "png":
						case "jpg":
						case "webm":
							post.preview.url = 'https://static1.e621.net/data/preview/' + post.file.md5.slice(0, 2)  + '/' + post.file.md5.slice(2, 4) + '/' + post.file.md5 + '.jpg';
							break;
					}
				}
			}


			// Skip post if location is undefined
			var skip = false;
			if ((post.file.url == null || post.file.url.length < 1) && (post.sample.url == null || post.sample.url.length < 1) && (post.preview.url == null || post.preview.url.length < 1)) {
				skip = true;
			}

			if (skip) {
				filtercount++;
				return;
			} else {
				var allow = true;
				Object.entries(post.tags).forEach((tagArray)=>{
					tagArray[1].forEach((tag)=>{
						localStorage.search_temporaryBlacklist.split("`").forEach((btag)=>{
							if (tag.toLowerCase() == btag.toLowerCase()) {
								allow = false;
							}
						})
						localStorage.search_blacklistedTags.split(",").forEach((btag)=>{
							if (tag.toLowerCase() == btag.toLowerCase()) {
								allow = false;
							}
						})
					})
				})
				if (allow) {
					returnedPosts.posts.push(post);
				} else {
					filtercount++;
				}
			}
		})
		console.debug(`[search.js] Filteded out '${filtercount}' posts.`);
		return returnedPosts;
	},
	generatePageHTML: (posts) => {
		var htmlPostArray = [];
		posts.posts.forEach((post)=>{
			if (post.file.url == undefined  && post.sample.url == undefined  && post.preview.url == undefined ) {
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
		console.debug(`[search.js] Tags given`,t_tags);
		if (localStorage.ratingFilter != 'none') {
			t_tags=`rating:${localStorage.ratingFilter}+${t_tags}`
		}
		esix.loader.show()
		esix.loader.content(`Querying tag(s); "${t_tags}"`,`Processing Request`);
		var oposts = await api.getPostsByTag({tags:[t_tags],limit:localStorage.postsPerPage || '90'});
		var returnedPosts = module.exports.filterPosts(oposts);
		
		localStorage.currentTags = t_tags;
		console.debug(`[search.js] Recieved ${returnedPosts.posts.length} posts`,returnedPosts);
		esix.searchStorage.currentPosts = [];
		
		localStorage.currentPage = 0;
		localStorage.totalPages = 0;
		$(".searchResults").html(module.exports.generatePageHTML(returnedPosts))
		$("div.pageControl").fadeIn("200ms");
		esix.loader.content(undefined,`Request Completed`)
		setTimeout(()=>{
			esix.loader.hide()
		},2500)
		$("div.searchBar li.searchButtons a#saveTag").click(()=>{
			// Save current tag, if there are none then show message saying there are no tags selected/searched`
			var tempTags = []
			if (localStorage.savedTags == undefined) {
				localStorage.savedTags = '';
			}
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
		$("div.searchBar li.searchButtons a#options").click(()=>{
			// Toggle display of options dropdown menu.
			$("div.searchSettings").addClass("show");
		});
		$("div.pageControl a#prev_page").click(()=>{
			module.exports.generatePreviousPage();
		})
		$("div.pageControl a#next_page").click(async()=>{
			module.exports.generateNextPage();
		})
	},
	generateNextPage: async () => {
		console.debug("[search] [generateNextPage] Called")
		try {
			var $ = esix.modules.jquery;
			// Append contents of next page to "searchResults"
			var pageToGoto = parseInt(localStorage.currentPage) + 1;
			if (localStorage.nextPageLoading == "true") return;
			localStorage.acceptKeyboardInput = false;
			localStorage.nextPageLoading = true;
			console.log(pageToGoto, localStorage.currentPage, localStorage.currentPostIndex)
			esix.loader.show();
			esix.loader.caption("Loading Page "+pageToGoto);
			var newPage = await esix.api.getPostsByTag({tags:[localStorage.currentTags],limit:localStorage.postsPerPage || '90',page:pageToGoto});
			$("div.searchResults").append(module.exports.generatePageHTML(newPage));
			$("div.pageControl #pageCount").html(localStorage.totalPages);
			esix.loader.caption("Loaded Page "+pageToGoto);
			setTimeout(()=>{
				esix.loader.hide();
				localStorage.nextPageLoading = false;
			},1500)
			localStorage.acceptKeyboardInput = true;
		} catch (e) {
			console.error(e)
		}

	},
	generatePreviousPage: () => {
		// scroll to the top of the previous page
			var pageToGoto = localStorage.currentPage - 1;
		if ($(`div.searchResults div.page${pageToGoto}`).length) {
			// Scroll to page
			$([document.documentElement, document.body]).animate({
				scrollTop: $(`div.searchResults div.page${localStorage.currentPage}`).offset().top
			}, 2000);
		}
	},
	preloadSearchPages: async (ourID) => {
		console.debug(ourID,localStorage.local_currentTabID)
		if (ourID != localStorage.local_currentTabID) return;
		var $ = esix.modules.jquery
		if ($("div.searchOptionsWindow input#preloadPageCount").val().length < 1) {
			// Empty
			return;
		}
		if ($("div.searchBar nav.smallSearch input#search").val().length < 1){
			// No tags
			return;
		}
		localStorage.preloadPageCount = parseInt($("div.searchOptionsWindow input#preloadPageCount").val());
		localStorage.currentPage = 0;
		localStorage.totalPages = 0;
		$("div.searchResults").html(' ');
		$("div.preloader").fadeIn("fast")
		$("div.preloader div.container h4").html("Processing Posts")
		esix.searchStorage.currentPosts = [];
		var preloadQueue = new esix.queue({log:true})
		for (let i = 0; i < localStorage.preloadPageCount; i++) {
			preloadQueue.add(async ()=>{
				if (i > localStorage.preloadPageCount) return;
				var pageToGoto = i+1;
				console.debug(i > localStorage.preloadPageCount,i,localStorage.preloadPageCount)
				$("div.preloader div.container h5#loadingStatus").html(`Fetching Page '${pageToGoto}'`)
				console.debug(`[search -> preloadSearchPages] ${localStorage.currentPage} -> (${pageToGoto}, ${localStorage.preloadPageCount})`)
				var newPage = await esix.api.getPostsByTag({tags:[localStorage.currentTags],limit:localStorage.postsPerPage || '90',page:pageToGoto});
				console.debug(`[search -> preloadSearchPages] Recieved posts for page '${pageToGoto}'`,newPage)
				$("div.preloader div.container h5#loadingStatus").html(`Recieved '${newPage.posts.length}' posts for Page '${pageToGoto}'`)
				$("div.searchResults").append(module.exports.generatePageHTML(newPage));
				localStorage.currentPage = i + 1;
				console.debug(`PAGE ${localStorage.currentPage} DONE`)
			})
		}
		await preloadQueue.start(()=>{
			console.debug(`[search -> preloadSearchPages] Preloaded '${localStorage.preloadPageCount}' page(s) with ${esix.searchStorage.currentPosts.length} posts.`);
			
			$("div.preloader div.container h5#loadingStatus").html(`Done!`)
			$("div.preloader div.container h4").html('Loading')
			setTimeout(()=>{
				$("div.preloader").fadeOut('fast')
			},2500)
			return;
		});
	},
	searchOptionsManager: (ourID) => {
		if (ourID != localStorage.local_currentTabID) return;
		var $ = esix.modules.jquery;
		console.debug($("div.searchOptionsWindow"))
		$("div.searchOptionsWindow").addClass("show");
		$("div.searchOptionsWindow input#preloadPageCount").keyup((me)=>{
			if (me.keyCode != 13) return;
			module.exports.preloadSearchPages(ourID)
		})
		$("div.searchOptionsWindow a#preloadPageButton").click((me)=>{
			module.exports.preloadSearchPages(ourID)
		})
		$("div.searchOptionsWindow select#rating").click((me)=>{
			var selectedRating = me.target.selectedOptions[0].value
			switch(selectedRating) {
				case "s":
					localStorage.ratingFilter = 'safe';
					break;
				case "q":
					localStorage.ratingFilter = 'questionable';
					break;
				case "e":
					localStorage.ratingFilter = 'explicit';
					break;
				case "null":
					localStorage.ratingFilter = 'none';
					break;
			}
			localStorage.ratingFilter = selectedRating;
		})
		$("div.searchOptionsWindow div.content i.close").click(()=>{
			$("div.searchOptionsWindow").removeClass("show")
			return;
		})

		$("div.searchOptionsWindow input#tempTagBlacklist").on('keyup',(me)=>{
			if (me.keyCode != 13) return;
			// Submit and Save Temp Blacklisted Tags
			if ($("div.searchOptionsWindow input#tempTagBlacklist").val().length < 1){
				localStorage.search_temporaryBlacklist = "";
				esix.notification('warn',`Cleared Temporary Blacklist`,2500)
			} else {
				localStorage.search_temporaryBlacklist = $("div.searchOptionsWindow input#tempTagBlacklist").val().split(" ").join("`")
		
				esix.notification('info',`Changed Temporary Blacklist`,2500)
			}
		})
	},
	listen: (ourID)=>{
		if (!localStorage.credentialsValidated) return;
		if (ourID != localStorage.currentTabID) return;
		console.debug("[settings.js] listen => called");
		var $ = esix.modules.jquery;
		console.debug(esix)

		if (localStorage.ratingFilter == undefined) {
			localStorage.ratingFilter = 'none';
		}
		$(window).scroll(function() {
			if (localStorage.currentTab != "search") return;
			if ($(this).scrollTop() <= 90) {
				// Remove Custom Action
				$("div.searchBar").removeClass("scrollPast");
			} else {
				// Add Custom Action
				$("div.searchBar").addClass("scrollPast");
			}
		});
		$("div.input-field input#search[type=search]").keyup(async (me)=>{
			if (me.which != 13) return;
			module.exports.generateSearchResults($("div.input-field input#search[type=search]").val().split(' ').join("+"))
		})
		$("div.searchBar li.searchButtons a#options").click(()=>{
			var localUID = UIDGen();
			localStorage.local_currentTabID = localUID;
			module.exports.searchOptionsManager(localUID);
			return;
		})
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
		$(window).scroll(function() {
			if ($(window).scrollTop() > 100) {
				$("div.searchBar").removeClass("topOfPage")
			}
			else {
				$("div.searchBar").addClass("topOfPage")
			}
		});
	},
	fullScreen: (g_post)=>{
		var postData = g_post;
		if (typeof imgDATA == 'string') {
			postData = JSON.parse(atob(g_post));
			console.debug(`[search.js] Decoded image ${postData.id} post data`,postData);
		} else if (/^\d+$/.test(g_post)) {
			esix.searchStorage.currentPosts.forEach((fp)=>{
				if (fp.id == g_post) {
					postData = fp;
				}
			})
		}

		if (g_post == undefined) {
			return;
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

		localStorage.currentPostIndex = currentPostIndex;
		console.debug(`[search] Parsed Image Data`,postData)
		if (parseInt(localStorage.currentPostIndex) >= esix.searchStorage.currentPosts.length - 21 && (parseInt(localStorage.currentPage) < parseInt(localStorage.totalPages) || parseInt(localStorage.totalPages) == 1)) {
			// Load next page.
			module.exports.generateNextPage();
		}

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
		var postImageContent = `<img src="${postData.file.url || postData.sample.url || postData.preview.url}" onerror="this.src='https://cdn.jyles.club/missing-post.png'">`;
		if (postData.file.ext.toLowerCase().trim() == "webm") {
			if (localStorage.additionalVideoOptions == undefined) {
				localStorage.additionalVideoOptions = "autoplay loop";
			}
			postImageContent = `
					<video controls="controls" poster="${postData.preview.url || postData.sample.url}" ${localStorage.additionalVideoOptions}>
						<source src="${postData.file.url}" type="video/${postData.file.ext}">
					</video>
			`;
		}
		var postTable = `
		<table class="post-fullscreen">
			<tr class="post">
				<td class="post-previous">
					${previousPostButton}
				</td>
				<td class="post-image">
					${postImageContent}
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
						<i class="material-icons post-control" id="addToQueue" data="${postData.id}">add_to_photos</i>
						<i class="material-icons post-control" id="upvote" data="${postData.id}">arrow_upward</i>
						<span class="post-control" id="postscore">${postData.score.total}</span>
						<i class="material-icons post-control" id="downvote" data="${postData.id}">arrow_downward</i>
						<i class="material-icons post-control favourite-${esix.searchStorage.currentPosts[localStorage.currentPostIndex].is_favorited}" id="favorite" status="${esix.searchStorage.currentPosts[localStorage.currentPostIndex].is_favorited}">star_border</i>
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
		// Create HTML and fire external link listener.
		if ($("div.fullscreenResult").length) {
			$("div.fullscreenResult").html(`${postTable}${postInfo}`)
		} else {
			$("div.pageContent").append(finalHTML)
		}
		esix.externalLink();

		$("div.post-info i.window-control").click(()=>{
			module.exports.keylisten_fullscreen('exit')
		})
		localStorage.currentPostIndex = currentPostIndex;
		if (parseInt(localStorage.currentPostIndex) == 0) {
			// No Back Button, we are at the begining.
			localStorage.nextPostID = esix.searchStorage.currentPosts[parseInt(localStorage.currentPostIndex)+1].id
			localStorage.nextPostIndex = parseInt(localStorage.currentPostIndex)+1;
			localStorage.previousPostID = null
			localStorage.previousPostIndex = null;
		} else if (parseInt(localStorage.currentPostIndex) == esix.searchStorage.currentPosts.length - 1) {
			// No Forward Button, we are at the end
			localStorage.nextPostID = null;
			localStorage.nextPostIndex = null;
			localStorage.previousPostID = esix.searchStorage.currentPosts[currentPostIndex-1].id;
			localStorage.previousPostIndex = parseInt(localStorage.currentPostIndex)-1;
		} else if (parseInt(localStorage.currentPostIndex) != 0 && parseInt(localStorage.currentPostIndex) != parseInt(esix.searchStorage.currentPosts.length) - 1) {
			localStorage.nextPostID = esix.searchStorage.currentPosts[parseInt(localStorage.currentPostIndex)+1].id
			localStorage.nextPostIndex = parseInt(localStorage.currentPostIndex)+1;
			localStorage.previousPostID = esix.searchStorage.currentPosts[parseInt(localStorage.currentPostIndex)-1].id;
			localStorage.previousPostIndex = parseInt(localStorage.currentPostIndex)-1;
		}
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
		$("i.post-control#favorite").click((me)=>{
			module.exports.favoriteHandle();
		})
		// Upvote
		$("i.post-control#upvote").click(()=>{
			module.exports.keylisten_fullscreen('actionup');
		})
		// Downvote
		$("i.post-control#downvote").click(()=>{
			module.exports.keylisten_fullscreen('actiondown');
		})
		// Add to Queue
		$("i.post-control#addToQueue").click(()=>{
			var didThePostGetAdded = esix.pages.download.addToQueue(esix.searchStorage.currentPosts[localStorage.currentPostIndex]);
			console.debug(didThePostGetAdded,esix.searchStorage.currentPosts[localStorage.currentPostIndex])
			if (didThePostGetAdded) {
				esix.notification('info','Post Added to Download Queue')
			} else {
				esix.notification('error','Post Already Exists in Download Queue')
			}
		})
		return;
	},
	favoriteHandle: () => {
		var currentStatus = $("i.post-control#favorite").attr("status");
		console.log(currentStatus)
		if (currentStatus == "true") {
			var postID = esix.searchStorage.currentPosts[localStorage.currentPostIndex].id;
			esix.searchStorage.currentPosts[localStorage.currentPostIndex].is_favorited = 'false';
			esix.api._req(`favorites/${postID}.json`,'delete',{post_id:postID})
			$("i.post-control#favorite").attr("status","false")
			$("i.post-control#favorite").removeClass("favorite-true");
			$("i.post-control#favorite").addClass("favorite-false");
		} else {
			var postID = esix.searchStorage.currentPosts[localStorage.currentPostIndex].id;
			esix.searchStorage.currentPosts[localStorage.currentPostIndex].is_favorited = 'true';
			esix.api._req(`favorites.json?post_id=${postID}`,'post',{post_id:postID})
			$("i.post-control#favorite").attr("status","true")
			$("i.post-control#favorite").addClass("favorite-true");
			$("i.post-control#favorite").removeClass("favorite-false");

		}
	},
	vote: async (direction) => {
		var $ = esix.modules.jquery;
		switch(direction) {
			case "up":
				var postID = esix.searchStorage.currentPosts[localStorage.currentPostIndex].id;
				var currentPost = esix.searchStorage.currentPosts[localStorage.currentPostIndex];
				var response = await esix.api.votePost(true,postID,true);
				esix.searchStorage.currentPosts[localStorage.currentPostIndex].score = response;
				esix.searchStorage.currentPosts[localStorage.currentPostIndex].score.total = response.score;
				console.debug(response)
				if (esix.isFullscreen()) {
					$(`span.post-control#postscore`).html(esix.searchStorage.currentPosts[localStorage.currentPostIndex].score.total)
					$(`i.post-conntrol#upvote[data=${postID}]`).addClass("toggleStatus");
					$(`i.post-conntrol#downvote[data=${postID}]`).addClass("toggleStatus");
				}
				break;
			case "down":
				var postID = esix.searchStorage.currentPosts[localStorage.currentPostIndex].id;
				var currentPost = esix.searchStorage.currentPosts[localStorage.currentPostIndex];
				var response = await esix.api.votePost(false,postID,true);
				esix.searchStorage.currentPosts[localStorage.currentPostIndex].score = response;
				esix.searchStorage.currentPosts[localStorage.currentPostIndex].score.total = response.score;
				if (esix.isFullscreen()) {
					$(`span.post-control#postscore`).html(esix.searchStorage.currentPosts[localStorage.currentPostIndex].score.total)
					$(`i.post-conntrol#downvote[data=${postID}]`).addClass("toggleStatus");
					$(`i.post-conntrol#upvote[data=${postID}]`).addClass("toggleStatus");
				}
				break;
		}
	},
	keylisten: (keyAction) => {
		if (localStorage.acceptKeyboardInput == 'false') return;
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
			case "save":
				var didThePostGetAdded = esix.pages.download.addToQueue(esix.searchStorage.currentPosts[localStorage.currentPostIndex]);
				console.debug(didThePostGetAdded,esix.searchStorage.currentPosts[localStorage.currentPostIndex])
				if (didThePostGetAdded) {
					esix.notification('info','Post Added to Download Queue')
				} else {
					esix.notification('error','Post Already Exists in Download Queue')
				}
				break;
			case "favorite":
				module.exports.favoriteHandle();
				break;
			case "exit":
				localStorage.search_isFullscreen = 'false';
				$("div.fullscreenResult").fadeOut('fast')
				$("div.fullscreenResult").remove()
				break;
		}
	}
}