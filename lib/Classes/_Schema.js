module.exports = {
	"type$Client.Options": {
		"id": "/Client/Options",
		"type": "object",
		"properties": {
			"auth": "/Authentication/JSON",
			"developermetrics": "boolean",
			"product": "/Client/Product",
			"endpoint": "/WebClient/Endpoint"
		}
	},
	"type$AuthR.JSON": {
		id: "/Authentication/JSON",
		type: "object",
		properties: {
			enabled: "boolean",
			login: "/Authentication/Username",
			apikey: "/Authentication/Passphrase"
		}
	},
	"type$AuthR.Username": {
		id: "/Authentication/Username",
		type: "string",
		pattern: "^[a-zA-Z0-9_\-]{1,}$"
	},
	"type$AuthR.APIKey": {
		id: "/Authentication/Passphrase",
		type: "string",
		pattern: "^[a-zA-Z0-9_\-]{1,}$"
	},
	"type$AuthR.Email": {
		id: "/Authentication/Email",
		type: "string",
		pattern: `^(?:[a-z0-9!#$%&'*+/=?^_\`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_\`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$`
	}
}