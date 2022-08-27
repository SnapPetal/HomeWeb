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
			method: 'post',
			url: 'https://3f1xw41yse.execute-api.us-east-1.amazonaws.com/joke',
			data: `${joke}`,
			headers: {
				"content-type": "text/plain",
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
