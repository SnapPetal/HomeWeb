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
			url: 'https://3f1xw41yse.execute-api.us-east-1.amazonaws.com/',
			data: {
				joke
			},
			headers: {
				"content-type": "application/json",
				"Accept": "application/json",
				"Access-Control-Allow-Origin": "*"
			}
		}).then((response) => {
			const {key} = response.data;
			document.getElementById("dataJokeAudioControl").src = `./${key}`;
			document.getElementById("dataJokeAudioControl").load();
		});
	});
}
