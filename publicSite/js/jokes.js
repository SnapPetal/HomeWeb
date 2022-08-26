var BASE64_MARKER = ';base64,';

function getRandomJoke() {
	axios({
		method: 'get',
		url: 'https://icanhazdadjoke.com/',
		headers: {
			"content-type": "text/plain",
			"Accept": "application/json"
		}
	}).then((response) => {
		const { joke } = response.data;
		axios({
			method: 'get',
			url: 'https://w54rs5fe5j.execute-api.us-east-1.amazonaws.com/',
			data: {
				joke
			},
			headers: {
				"content-type": "application/json",
				"Accept": "audio/ogg",
				"Access-Control-Allow-Origin": "*"
			}
		}).then((response) => {
			document.getElementById("dataJokeAudioControl").src = `data:audio/ogg;base64,${response.data}`;
			document.getElementById("dataJokeAudioControl").load();
		});
	});
}
