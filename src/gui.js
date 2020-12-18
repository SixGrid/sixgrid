global.esix = {
	modules: {
		api: require("esix-api"),
		jquery: require("jquery"),
		md5: require("md5"),
		salert: require("sweetalert")
	},
	pages: {
		search: require("./search.js"),
		home: require("./home.js"),
		settings: require("./settings.js"),
		debug: require("./debugpage.js"),
		gettingstarted: require("./gettingStarted.js"),
	},
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
		$("div.notification").removeClass('show')
		$("div.notification span").html(g_context)
		$("div.notification").removeClass('info')
		$("div.notification").removeClass('warn')
		$("div.notification").removeClass('error')
		$("div.notification").addClass(g_type.toLowerCase())
		$("div.notification").addClass('show')
		setTimeout(()=>{
			$("div.notification").removeClass('show')
			$("div.notification").removeClass('info')
			$("div.notification").removeClass('warn')
			$("div.notification").removeClass('error')
			$("div.notification span").html('')
		},localStorage.notificationDecay || g_duration || 2500);
		return;
	},
	queue: require("./queue.js"),
	searchStorage: { },
	electron: require("electron"),
	downloadPost: (post)=>{
		// Save variable to know progress
		var b_dll = `${localStorage.downloadLocation || require("electron").remote.app.getPath("downloads")}${esix.osSeperator}${esix.packageJSON.productName}`;
		var dll = `${b_dll}${esix.osSeperator}${localStorage.currentTags.replace(":","").replace("*","").replace("?","").replace("<","").replace(">","").replace('"',"'").replace('|',"")}`;
		
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
	osSeperator: "/",
}

if (esix.electron.remote.process.platform == 'win32') {
	esix.osSeperator = "\\";
}

// Misc stuff
const $ = esix.modules.jquery;
$("a#branding").html(esix.packageJSON.productName)
$(document).ready(()=>{
	esix.loader.caption("Done!")
	setTimeout(()=>{
		esix.loader.hide()
	},1200)
})//rating:safe femboy outside
if (localStorage.debugMode) {
	$("#navbarLinks").append(`<li><a data="debug">Debug Menu</a></li>`)
}
if  (localStorage.firstTime == true || localStorage.firstTime == undefined) {
	new esix.pageManager().function('gettingstarted');
}else {
	global.esix.api = new esix.modules.api({username: localStorage.auth_username,key: localStorage.auth_key,});
	new esix.pageManager().pageListen()
}

console.debug(`[gui.js] esix global`,esix)

// Start Page Listener