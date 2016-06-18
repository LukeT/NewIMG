{
	"db": {
		"db": "newimg",
		"username": "root",
		"password": "root",
		"hostname": "docker.local"
	},
	"defaultTransport": "file",
	"hashids": {
		"salt": "meow"
	},
	"redis": {
		"host": "docker.local"
	},
	"transports": {
		"file": {
			"location": ".uploads"
		}
	},
	"urls": {
		"uploads": "http://127.0.0.1:3000/uploads",
		"api": "http://127.0.0.1:3000/v1"
	},
	"web": {
		"port": 7070,
		"jwt": "derp"
	}
}
