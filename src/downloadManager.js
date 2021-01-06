async function asyncForEach (array, callback) {
	for (let index = 0; index < array.length; index++) {
		await callback(array[index], index, array)
	}
}
function formatSizeUnits(bytes){
  if      (bytes >= 1073741824) { bytes = (bytes / 1073741824).toFixed(2) + " GB"; }
  else if (bytes >= 1048576)    { bytes = (bytes / 1048576).toFixed(2) + " MB"; }
  else if (bytes >= 1024)       { bytes = (bytes / 1024).toFixed(2) + " KB"; }
  else if (bytes > 1)           { bytes = bytes + " bytes"; }
  else if (bytes == 1)          { bytes = bytes + " byte"; }
  else                          { bytes = "0 bytes"; }
  return bytes;
}
const queue = require("./queue.js")
module.exports = {
	addToQueue: (g_postData) => {
		if (localStorage.downloadQueue == undefined) {
			localStorage.downloadQueue = JSON.stringify({queue: []})
		}
		if (JSON.parse(localStorage.downloadQueue).queue.length < 1) {
			var t_dlQueue = JSON.parse(localStorage.downloadQueue);
			t_dlQueue.queue.push({
				postData: g_postData,
				addedTimestamp: Math.round(Date.now() / 1000)
			});
			localStorage.downloadQueue = JSON.stringify(t_dlQueue)
			return true;
		}
		var existsAlready = false;
		JSON.parse(localStorage.downloadQueue).queue.forEach((queueObject)=>{
			if (g_postData.id == queueObject.postData.id) {
				existsAlready = true;
			}
		})
		if (!existsAlready) {
			var t_dlQueue = JSON.parse(localStorage.downloadQueue);
			t_dlQueue.queue.push({
				postData: g_postData,
				addedTimestamp: Math.round(Date.now() / 1000)
			});
			localStorage.downloadQueue = JSON.stringify(t_dlQueue)
		}
		return !existsAlready;
	},
	defaultPage: ()=>{
		return `
		<div class="container">
			<h1>Download Manager</h1>
			<div class="downloadHistory">
				<div class="queueContainer">
					<span>Download Queue is Empty. To fill this up click on a post to go into fullscreen then click on the plus button that is to the right of the exit button.</span>
				</div>
				<div class="downloadQueue-control">
					<ul>
						<li>
							<a class="waves-effect waves-light btn disabled" id="startQueue">Start Queue</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
		`;
	},
	generateTable: async ()=>{
		var $ = esix.modules.jquery;
		var t_queueTableContent = [];
		await asyncForEach(JSON.parse(localStorage.downloadQueue).queue,async (queueObject)=>{
			console.debug(`[${queueObject.postData.id}] => queuedObject`,queueObject)
			console.debug(`[downloadManager] ${queueObject.postData.id} => Base64 Length; ${esix.base64.encode(JSON.stringify(queueObject.postData)).length}`)
			var content = `
			<tr postID="${queueObject.postData.id}" data-type="b64_post" data="${esix.base64.encode(JSON.stringify(queueObject.postData))}">
				<td class="thumbnail">
					<img src="${queueObject.postData.preview.url || queueObject.postData.sample.url || queueObject.postData.file.url}"  onerror="this.src='https://cdn.jyles.club/missing-post.png'">
				</td>
				<td class="postInfo">
					<ul class="postInfo">
						<li data-type="id" data="${queueObject.postData.id}">${queueObject.postData.id}</li>
						<li data-type="rating" data="${queueObject.postData.rating}" class="rating-${queueObject.postData.rating}">Rated as ${esix.ratingParse(queueObject.postData.rating)}</li>
						<li data-type="uploader" data="${queueObject.postData.uploader_id}">Uploaded by <span id="outsidelink" data="https://e621.net/users/${queueObject.postData.uploader_id}">${queueObject.uploaderData.name}</span> (${queueObject.postData.uploader_id})</li>
						<li data-type="b64_artist" data="${btoa(queueObject.postData.artist)}">Artist(s); ${queueObject.postData.tags.artist.join(", ")}</li>
					</ul>
				</td>
				<td>
					<span data-type="b64_description" data="${esix.base64.encode(queueObject.postData.description)}">${esix.modules.removeMarkdown(queueObject.postData.description).replace("\r\n","<br>")}</span>
				</td>
				<td class="postOptions">
					<ul class="postOptions">
						<li><i class="material-icons" id="removePost" data-type="id" data="${queueObject.postData.id}">close</i></li>
					</ul>
				</td>
			</tr>
			`;
			t_queueTableContent.push(content)
		})
		var tableContent = `
		<table class="historyList">
			<tr>
				<th>Thumbnail</th>
				<th>Post Info</th>
				<th>Description</th>
				<th>Post Options</th>
			</tr>
			${t_queueTableContent.join("\r\n")}
		</table>`;
		$("div.downloadHistory div.queueContainer").html(tableContent)
		return;
	},
	downloadQueue: () => {
		var $ = esix.modules.jquery;
		if (JSON.parse(localStorage.downloadQueue).queue.length < 1) return;

		if (!fs.existsSync(`${localStorage.downloadLocation || require("electron").remote.app.getPath("downloads")}${esix.osSeperator}${esix.packageJSON.productName}`)) {
			fs.mkdirSync(`${localStorage.downloadLocation || require("electron").remote.app.getPath("downloads")}${esix.osSeperator}${esix.packageJSON.productName}`);
		}

		$("div.queueContainer").fadeOut("fast");
		$("div.main-navbar").fadeOut("fast");
		var baseHTML = `
		<div class="queueDownloader">
			<table>
				<tr>
					<th>Download Statistics</th>
					<th>Queued Items</th>
				</tr>
				<tr>
					<td style="vertical-align: top;">
						<table class="totalStats">
							<tr>
								<td class="stats"><span id="downloadedSize"></span> (<span id="postcount">0 / ${JSON.parse(localStorage.downloadQueue).queue.length}</span> items)</td>
								<td class="totalProgress">
									<div class="progress">
										<div class="determinate" style="width: 0%"></div>
									</div>
								</td>
							</tr>
						</table>
					</td>
					<td>
						<table class="queuedItems">
							<!--tr data="postID">
								<td class="thumbnail"><img src="test.jpg"></td>
								<td class="downloadedSize">3mb</td>
								<td class="totalProgress">
									<div class="progress">
										<div class="determinate" style="width: 0%"></div>
									</div>
								</td>
							</tr-->
						</table>
					</td>
				</tr>
			</table>
		</div>
		`;
		$("div.pageContent div.container").append(baseHTML)
		var downloadQueue = {queue:[]};
		var totalBytes = 0;
		JSON.parse(localStorage.downloadQueue).queue.forEach((queueObject) => {
			var imageURL = '';
			var imageSize = '';
			if (queueObject.postData.file.url != undefined) {
				imageURL = queueObject.postData.file.url
				imageSize = queueObject.postData.file.size
				totalBytes = totalBytes + imageSize;
			}
			else if (queueObject.postData.sample.url != undefined) {
				imageURL = queueObject.postData.sample.url
				imageSize = "unknown size";
			}
			else if (queueObject.postData.preview.url != undefined) {
				imageURL = queueObject.postData.preview.url
				imageSize = "unknown size";
			}
			var dataToEncode = {
				fullData: queueObject,
				image: {
					url: imageURL,
					size: imageSize
				}
			}
			console.debug(`[${queueObject.postData.id}] Item Added to Visual Queue => `,dataToEncode)
			var rowHTML = `
				<tr postID="${queueObject.postData.id}" data="${btoa(dataToEncode)}">
					<td class="thumbnail"><img src="${queueObject.postData.preview.url || queueObject.postData.sample.url || queueObject.file.url}"></td>
					<td class="downloadedSize">${formatSizeUnits(imageSize)}</td>
					<td class="totalProgress">
						<div class="progress">
							<div class="determinate" style="width: 0%"></div>
						</div>
					</td>
				</tr>
			`;
			$("div.queueDownloader table.queuedItems").append(rowHTML);
			downloadQueue.queue.push(dataToEncode)
		})
		$("div.queueDownloader table.totalStats td.stats span#downloadedSize").html(`0 bytes / ${formatSizeUnits(totalBytes)}`)

		var itemQueue = new queue({log:true})
		var itemsDownloaded = 0;
		var totalBytesDownloaded = 0;
		var totalBytesToDownload = 0;
		downloadQueue.queue.forEach((objectData)=>{
			// Save variable to know progress
			var b_dll = `${localStorage.downloadLocation || require("electron").remote.app.getPath("downloads")}${esix.osSeperator}${esix.packageJSON.productName}`;
			var dll = `${b_dll}${esix.osSeperator}downloadQueue`;
			
			var received_bytes = 0;
			var total_bytes = 0;
			var request = require("request");
			var fs = require("fs");
			var md5 = require("md5")

			if (!fs.existsSync(b_dll)) {
				fs.mkdirSync(b_dll)
			}

			var g_url = objectData.image.url;

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
			if (!fs.existsSync(downloadLocation)) {
				fs.mkdirSync(downloadLocation)
			}
			var targetPath = `${downloadLocation}${esix.osSeperator}${objectData.fullData.postData.id}.${g_url.split('.')[g_url.split('.').length - 1]}`;
			var out = fs.createWriteStream(targetPath);
			req.pipe(out);
			$(`div.queueDownloader table.queuedItems tr[postID=${objectData.fullData.postData.id}] td.totalProgress div.progress div.determinate`).width("0%");

			req.on('response', function ( data ) {
				// Change the total bytes value to get progress later.
				total_bytes = parseInt(data.headers['content-length' ]);
				totalBytesToDownload += parseInt(data.headers['content-length' ])
			});
		
			req.on('data', function(chunk) {
				// Update the received bytes
				totalBytesDownloaded += chunk.length
				received_bytes += chunk.length;
				$("div.queueDownloader table.totalStats td.totalProgress div.progress div.determinate").width(`${(totalBytesDownloaded/totalBytesToDownload)*100}%`)
				$("div.queueDownloader table.totalStats td.stats span#downloadedSize").html(`${formatSizeUnits(totalBytesDownloaded)} / ${formatSizeUnits(totalBytesToDownload)}`)
				console.debug(`${(totalBytesDownloaded/totalBytesToDownload)*100}%`)
				$(`div.queueDownloader table.queuedItems tr[postID=${objectData.fullData.postData.id}] td.totalProgress div.progress div.determinate`).width(`${Math.round((received_bytes/total_bytes)*100)}%`)
			});

			out.on('finish', function() {
				// Validate File
				console.debug(`[downloadManager] Downloaded url ${g_url}`)
				$(`div.queueDownloader table.queuedItems tr[postID=${objectData.fullData.postData.id}] td.totalProgress div.progress div.determinate`).width("100%")
				itemsDownloaded++;
				$("div.queueDownloader table.totalStats td.stats span#postcount").html(`${itemsDownloaded} / ${JSON.parse(localStorage.downloadQueue).queue.length}`)
				setTimeout(()=>{
					$(`div.queueDownloader table.queuedItems tr[postID=${objectData.fullData.postData.id}]`).fadeOut(50)
				},500)
			});
		})
		itemQueue.start(()=>{
			$("div.main-navbar").fadeIn("fast");
			setTimeout(()=>{
				$("div.queueDownloader").fadeOut('fast')
				$("div.queueDownloader").remove()
			},1500)
			$("div.queueContainer").fadeOut("quick");
		});
	},
	listen: async ()=>{
		var $ = esix.modules.jquery;
		console.debug("[downloadManager] listen => called");
		if (localStorage.downloadQueue == undefined) {
			localStorage.downloadQueue = JSON.stringify({queue: []})
		}
		if (JSON.parse(localStorage.downloadQueue).queue.length < 1) return;
		$("div.downloadHistory div.downloadQueue-control a.btn").removeClass("disabled")
		$("div.downloadHistory div.queueContainer").html("<h3>Processing</h3>")

		/*
		queueObejct {
			postData: <esix post result>
			addedTimestamp: <UNIX Timestamp when added>
		}
		*/

		// Get Uploaders Metadata and Cache it.
		var t_dlQueuegetUploader = {queue:[]}
		await asyncForEach(JSON.parse(localStorage.downloadQueue).queue,async (queueObject)=>{
			var t_queueObject = {
				postData: queueObject.postData,
				addedTimestamp: queueObject.addedTimestamp,
				uploaderData: queueObject.uploaderData || undefined,
			};
			if (queueObject.uploaderData === undefined) {
				var pUploader = await esix.api._req(`users/${queueObject.postData.uploader_id}.json`)
				console.debug(`[downloadManager] Recieved Uploaders Data for '${pUploader.name}'`,pUploader)
				if (pUploader.name.toLowerCase() == 'undefined' || pUploader.name.length < 1) {
					pUploader.name = 'Anonymous User';
				}
				t_queueObject.uploaderData = pUploader;
			}
			t_dlQueuegetUploader.queue.push(t_queueObject)
		})
		localStorage.downloadQueue = JSON.stringify(t_dlQueuegetUploader);

		await module.exports.generateTable();

		$("div.downloadQueue-control a#startQueue").click(()=>{
			module.exports.downloadQueue();
		})

		$("ul.postOptions i#removePost").click((me)=>{
			var postID = me.target.attributes.data.value;
			$(`div.downloadHistory div.queueContainer table.historyList tbody tr[postID=${postID}]`).fadeOut("fast")
			var t_queue = [];
			JSON.parse(localStorage.downloadQueue).queue.forEach((queueObject)=>{
				console.debug(queueObject.postData.id == postID,postID,queueObject.postData.id,queueObject)
				if (queueObject.postData.id != postID){
					t_queue.push(queueObject)
				}
			})
			localStorage.downloadQueue = JSON.stringify({queue:t_queue})
			esix.notification('info',`Removed Post '${postID}' from Download Queue`);
			console.debug(`[downloadManager] Data Pushed to 'localStorage.downloadQueue'`,{queue:t_queue})
			return;
		})
	}
}