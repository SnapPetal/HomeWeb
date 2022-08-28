function getRandomBibleVerse() {
	axios({
		method: 'get',
		url: 'https://bibleverse.thonbecker.com',
		headers: {
			"content-type": "application/json",
			"Accept": "application/json",
			"Access-Control-Allow-Origin": "*"
		}
	}).then((response) => {
		const { book,chapter,verse,text } = response.data;
		document.getElementById("bibleVerse").innerText = `${text} (${book} ${chapter}:${verse})`;
	});
}
