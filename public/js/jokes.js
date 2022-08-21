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
			url: 'https://hqgmdtf0t9.execute-api.us-east-1.amazonaws.com/',
			responseType: 'stream',
			data: {
				joke
			},
			headers: {
				"content-type": "application/json",
			}
		}).then((response)=>{
			console.log(response);
		});
	});
}
