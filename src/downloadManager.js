module.exports = {
	addToQueue: (g_postData) => {
		if (localStorage.downloadQueue == undefined) {
			localStorage.downloadQueue = JSON.stringify({queue: []})
		}
		JSON.parse(localStorage.downloadQueue).queue.forEach((queueObject)=>{
			if (g_postData.id == queueObject.postData.id) return;
			var t_dlQueue = JSON.parse(localStorage.downloadQueue);
			t_dlQueue.queue.push({
				postData: g_postData,
				addedTimestamp: Math.round(Date.now() / 1000)
			});
		})

		return
	},
	defaultPage: ()=>{
		return `
		<div class="container">
			<h1>Download Manager</h1>
			<div class="downloadHistory">
				<div class="dl-title">
					<span>Download Queue</span>
				</div>
				<div class="downloadQueue-control">
					<ul>
						<li>
							<a class="waves-effect waves-light btn disabled" id="startQueue">Start Queue</a>
						</li>
					</ul>
				</div>
				<div class="queueContainer">
					<h3>Queue Empty</h3>
				</div>
			</div>
		</div>
		`;
	},
	listen: ()=>{
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
		var t_queueTableContent = [];
		JSON.parse(localStorage.downloadQueue).queue.forEach((queueObject)=>{
			var content = `
			<tr data-type="b64_post" data="${btoa(JSON.stringify(queueObject.postData))}">
				<td class="thumbnail">
					<img src="${queueObject.postData.preview.url || queueObject.postData.sample.url || queueObject.postData.file.url}"  onerror="this.src='https://cdn.jyles.club/missing-post.png'">
				</td>
				<td>
					<ul class="postInfo">
						<li data-type="id" data="${queueObject.postData.id}">${queueObject.postData.id}</li>
						<li data-type="rating" data="${queueObject.postData.rating}" class="rating-${queueObject.postData.rating}">${esix.ratingParse(queueObject.postData.rating)}</li>
						<li data-type="uploader" data="${queueObject.postData.uploader}"><a href="https://e621.net/users/562248" class="uploader-level-${pUploader.level_string.toLowerCase()}">${pUploader.name}</a></li>
						<li data-type="b64_artist" data="${btoa(queueObject.postData.artist)}">${queueObject.postData.artist.join(", ")}</li>
					</ul>
				</td>
				<td>
					<span data-type="b64_description" data="${btoa(queueObject.postData.description)}">${esix.modules.removeMarkdown(queueObject.postData.description).replace("\r\n","<br>")}</span>
				</td>
				<td class="postOptions">
					<ul class="postOptions">
						<li><i class="material-icons" id="closePost" data-type="id" data="${queueObject.postData.id}">close</i></li>
					</ul>
				</td>
			</tr>
			`;
		})
		$("div.downloadHistory div.queueContainer").html(`<table class="historyList">\r\n${t_queueTableContent.join("\r\n")}\r\n</table>`)
	}
}