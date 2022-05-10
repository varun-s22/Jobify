# Jobify

Jobify, lists the job openings, of a region/public domain, according to the user's needs.
Just enter the job title/designation and the country, to get your listings. You can also apply filters like "Full-Time Job" or "Part-Time Job", set a bar for the salary .etc

## Requirements

1) Axios (for fetching data from API)
2) GSAP and ScrollTrigger (for animations)

You don't need to download these packages, including the script in `index.html` is fine.

You may need to get `API KEY` and `API ID` from the [Adzuna Api](https://developer.adzuna.com/), by creating an account with them.
Once you recieve the key and id, make a `config.js` file inside the `src` folder, and keep the key/id in that file.

This is how, your `config.js` should look like
```
const DATA = {
    "APIKEY": "{YOUR API KEY (in double quotes)}",
    "APIID": "{YOUR API ID (in double quotes)}"
}
```
