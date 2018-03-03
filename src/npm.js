import request from "request";

export default (name) => new Promise((resolve, reject) => {
	if(!/^[a-zA-Z]$/.test(name)) return reject(new Error("Text should be consisted of alphabet."));
	if(name.length < 4) return reject(new Error("The length of text should be bigger than 3."));
	if(name.length > 6) return reject(new Error("The length of text should be smaller than 7."));

	request(`https://npmjs.com/package/${name}`, (err, resp, body) => {
		if(resp.statusCode === 404) return resolve(false);
		if(resp.statusCode === 200) return resolve(true);

		reject(new Error("Unknown status code."));
	});
});
