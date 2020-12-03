class component {
	constructor () {
		this.$ = esix.modules.jquery;
	}

	defaultPage() {
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
		</div>
		`;
	}

	listen() {

	}
}

module.exports = component