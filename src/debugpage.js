module.exports = {
	listen: ()=>{
		var $ = esix.modules.jquery;
		console.debug("[debugPage.js] listen => called");
		$("#debug_setStorageVariable_btn").click(()=>{
			var objectBox = $("#debug_setStorageVariable-obj_box");
			var contentBox = $("#debug_setStorageVariable-content_box");
			if (objectBox.val().length < 1) {
				// No Object Given
				alert(`[debugPage.js] No object given`)
				return;
			}
			if (contentBox.val().length < 1){
				// No content given
				alert(`[debugPage.js] No content given`)
				return;
			}
			localStorage[objectBox.val()] = contentBox.val()
			alert(`[debugPage.js] Set localStorage object '${objectBox.val()}' with the content of '${contentBox.val()}'`)
		})
	},
	defaultPage: ()=>{
		return `
		<div class="container">
			<h3>Debug Page</h3>
			<h4>Browser Information</h4>
			<table>
				<tr>
					<th>SixGrid Version</th>
					<td>${esix.packageJSON.version}</td>
				</tr>
				<tr>
					<th>esix-api Version</th>
					<td>${esix.packageJSON.dependencies['esix-api']}</td>
				</tr>
				<tr>
					<th>Electron Version</th>
					<td>${clientInformation.appVersion}</td>
				</tr>
				<tr>
					<th>User Agent</th>
					<td>${clientInformation.userAgent}</td>
				</tr>
			</table>
			<hr>
			<h4>Login Credentials</h4>
			<table>
				<tr>
					<th>Username</th>
					<td>${localStorage.auth_username}</td>
				</tr>
				<tr>
					<th>Key</th>
					<td class="censorContent">${localStorage.auth_key}</td>
				</tr>
			</table>
			<h4>Set Local Storage Variable</h4>
			<div class="setLocStoreVar input-field">
				<div class="row">
					<label for="debug_setStorageVariable-obj_box">Object</label>
					<input type="text" id="debug_setStorageVariable-obj_box">
				</div>
				<div class="row">
					<label for="debug_setStorageVariable-content_box">Content</label>
					<input type="text" id="debug_setStorageVariable-content_box">
				</div>
				<a class="waves-effect waves-light btn" id="debug_setStorageVariable_btn">set</a>
			</div>
		</div>
		`;
	}
}