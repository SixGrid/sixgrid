global.esix = {
	modules: {
		api: require("esix-api"),
		jquery: require("jquery"),
		md5: require("md5"),
		salert: require("sweetalert"),
		removeMarkdown: require("remove-markdown"),
		fs: require("fs")
	},
	pages: {
		search: require("./search.js"),
		home: require("./home.js"),
		settings: require("./settings.js"),
		debug: require("./debugpage.js"),
		download: require("./downloadManager.js"),
		gettingstarted: require("./gettingStarted.js"),
	},
	keyListener: require("./keylisten.js"),
	pageManager: require("./pagemanager"),
	loader: require("./loader"),
	packageJSON: require("./../package.json"),
	content: (g_content) => {
		esix.modules.jquery('div.pageContent').animate({'opacity': 0}, 100, function () {
			$(this).html(g_content);
		}).animate({'opacity': 1}, 200);
		return;
	},
	notification: (g_type,g_context,g_duration) => {
		var t_GUID = require("tinytoolbox").stringGen(6);
		$("div.notification ul").append(`
		<li GUID=${t_GUID} action="notification">
			<span type="${g_type}">${g_context}</span>
		</li>
		`)
		setTimeout(()=>{
			$(`div.notification li[GUID=${t_GUID}]`).addClass('active');
			setTimeout(()=>{
				$(`div.notification li[GUID=${t_GUID}]`).removeClass('active');
				setTimeout(()=>{
					$(`div.notification li[GUID=${t_GUID}]`).remove();
				},500)
			},localStorage.esix_notificationDecay || g_duration || 2500);
		},50)
		return;
	},
	queue: require("./queue.js"),
	searchStorage: { },
	electron: require("electron"),
	downloadPost: (post)=>{
		// Save variable to know progress
		var b_dll = `${localStorage.downloadLocation || require("electron").remote.app.getPath("downloads")}${esix.osSeperator}${esix.packageJSON.productName}`;
		var dll = `${b_dll}${esix.osSeperator}${localStorage.currentTags.replace(":","").replace(":","").replace("*","").replace("?","").replace("<","").replace(">","").replace('"',"'").replace('|',"")}`;
		
		var received_bytes = 0;
		var total_bytes = 0;
		var request = require("request");
		var fs = require("fs");
		var md5 = require("md5")

		if (!fs.existsSync(b_dll)) {
			fs.mkdirSync(b_dll)
		}

		var g_url = post.file.url || post.sample.url || post.preview.url;
		var g_md5 = post.file.md5 || post.sample.md5 || post.preview.md5;
		if (g_url == null || g_url == undefined) {
			return;
		}

		var req = request({
			method: 'GET',
			uri: g_url
		});

		// filter download location because windows is a prick
		var downloadLocation = dll.replace("*","").replace("?","").replace("<","").replace(">","").replace('"',"'").replace('|',"");
		var osSeperator = "/";
		if (esix.electron.remote.process.platform == 'win32') {
			osSeperator = "\\";
			downloadLocation = downloadLocation.replace("/","\\");
		}
		console.debug(downloadLocation)
		if (!fs.existsSync(downloadLocation)) {
			fs.mkdirSync(downloadLocation)
		}
		var targetPath = `${downloadLocation}${esix.osSeperator}${post.id}.${post.file.ext}`;
		var out = fs.createWriteStream(targetPath);
		req.pipe(out);
		$("div.downloadStatus div.determinate").width("0%");
		$("div.downloadStatus").addClass('downloading');

		req.on('response', function ( data ) {
			// Change the total bytes value to get progress later.
			total_bytes = parseInt(data.headers['content-length' ]);
		});
	
		req.on('data', function(chunk) {
			// Update the received bytes
			received_bytes += chunk.length;
			$("div.downloadStatus div.determinate").width(`${Math.round((received_bytes/total_bytes)*100)}%`)
		});

		out.on('finish', function() {
			// Validate File
			fs.readFile(targetPath,(e,b)=>{
				var fileMD5 = md5(b);
				if (g_md5 != fileMD5) {
					fs.unlinkSync(targetPath);
				}
			})
			console.debug(`[f: downloadFile] Downloaded url ${g_url}`)
			$("div.downloadStatus div.determinate").width("100%")
			if (localStorage.multiDL) {
				localStorage.multiDL_completedCount++;
			}else{
				setTimeout(()=>{
					$("div.downloadStatus").removeClass('downloading');
				},500)
			}
		});
	},
	base64: require("./base64.js"),
	ratingParse: (g_rating) => {
		g_rating = g_rating.toLowerCase()
		var lookup = {
			"s": "safe",
			"q": "questionable",
			"e": "explicit",
		};
		if (lookup[g_rating] != undefined) {
			return lookup[g_rating]
		} else {
			throw "Rating does not exist";
		}
	},
	osSeperator: "/",
	externalLink: () => {
		require("jquery")("span#outsidelink").click((me)=>{
			var outsideLink = me.target.attributes.data.value;
			require("electron").shell.openExternal(outsideLink);
		});
	},
	isFullscreen: () => {
		if (localStorage.search_isFullscreen.toLowerCase().trim().includes('true')) {
			return true;
		} else {
			return false;
		}
	},
	arrayContains: (obj, list) => {
		var x;
		for (x in list) {
			if (list.hasOwnProperty(x) && list[x] === obj) {
				return true;
			}
		}
		return false;
	}
}

// Reset Temporary Variables
localStorage.currentTags = '';
localStorage.currentPage = '';
localStorage.nextPostID = '';
localStorage.currentPostIndex = '';
localStorage.currentPostID = '';
localStorage.previousPostIndex = '';
localStorage.nextPostID = '';
localStorage.acceptKeyboardInput = true;
localStorage.previousPostID = '';
localStorage.nextPageLoading = false;
localStorage.totalPages = '';
localStorage.search_isFullscreen = false;
localStorage.nextPostIndex = '';
localStorage.search_temporaryBlacklist = '';
if (localStorage.search_bypassGlobalFilter == undefined) {
	localStorage.search_bypassGlobalFilter = 'true';
}
if (localStorage.blacklistedTags != undefined) {
	localStorage.search_blacklistedTags = localStorage.blacklistedTags;
	localStorage.blacklistedTags = undefined;
}

// Set OS Seperator
if (esix.electron.remote.process.platform == 'win32') {
	esix.osSeperator = "\\";
}

// Create API Instance and Fire off Key listener.
global.esix.loadSixgrid = () => {
	global.esix.api = new esix.modules.api({username: localStorage.auth_username,key: localStorage.auth_key,});
	esix.keyListener();
	new esix.pageManager().pageListen();
}

// Initalize More essential stuff
const $ = esix.modules.jquery;
$("a#branding").html(esix.packageJSON.productName);
$(document).ready(()=>{
	esix.loader.caption("Done!");
	setTimeout(()=>{
		esix.loader.hide();
	},1200)
})

// Add debug menu if were in debug mode.
if (localStorage.debugMode) {
	$("#navbarLinks").append(`<li><a data="debug">Debug Menu</a></li>`);
}

// When its our first time only allow user to access 'Getting Started'
if  (localStorage.firstTime == true || localStorage.firstTime == undefined) {
	new esix.pageManager().function('gettingstarted');
}else {
	// When its not our first time laod sixgrid
	esix.loadSixgrid();
}
console.debug(`[gui.js] esix global`,esix);