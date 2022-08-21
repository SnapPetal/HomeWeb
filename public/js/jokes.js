function getRandomJoke() {
	axios({
		method: 'get',
		url: 'https://icanhazdadjoke.com/',
		headers: {
			"content-type": "application/json",
			"Accept": "application/json"
		}
	}).then(function (response) {
		console.log(response.data.joke);
	});
}
