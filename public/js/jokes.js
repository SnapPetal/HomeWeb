function getRandomJoke() {
	axios({
		method: 'get',
		url: 'https://icanhazdadjoke.com/',
		headers: {
			"content-type": "application/json",
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
				"Accept": "audio/mpeg",
				"Access-Control-Allow-Origin": "*"
			}
		}).then((response) => {
			console.log(response);
		});
	});
}
