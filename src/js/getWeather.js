async function getWeather (locationObj) {
    const apiKey = "3fe1069690ebca35a5e25a328d0074a0";

    const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather" +
                              "?lat=" + locationObj.lat +
                              "&lon=" + locationObj.lon +
                              "&units=metric" +
                              "&appid=" + apiKey;
    
    const weeklyWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall" +
                             "?lat=" + locationObj.lat +
                             "&lon=" + locationObj.lon +
                             "&exclude=current,minutely,hourly,alerts" +
                             "&units=metric" +
                             "&appid=" + apiKey;

    const urls = [];

    urls.push(currentWeatherUrl, weeklyWeatherUrl);

    const jsons = await Promise.all(urls.map(async url => {
        const resp = await fetch(url);
        const json = await resp.json();

        return json;
    }));

    return jsons;
}

export default getWeather;