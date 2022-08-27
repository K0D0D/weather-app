async function getWeather ({ lat, lon }) {
    const apiKey = process.env.WEATHER_API_KEY;

    const currentWeatherUrl = "https://api.openweathermap.org/data/2.5/weather" +
                              "?lat=" + lat +
                              "&lon=" + lon +
                              "&units=metric" +
                              "&appid=" + apiKey;
    
    const weeklyWeatherUrl = "https://api.openweathermap.org/data/2.5/onecall" +
                             "?lat=" + lat +
                             "&lon=" + lon +
                             "&exclude=current,minutely,hourly,alerts" +
                             "&units=metric" +
                             "&appid=" + apiKey;

    const urls = [];

    urls.push(currentWeatherUrl, weeklyWeatherUrl);

    const data = await Promise.all(urls.map(async url => {
        const resp = await fetch(url);
        const json = await resp.json();

        return json;
    }));

    return data;
}

export default getWeather;