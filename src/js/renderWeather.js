function renderWeather (currentWeather, weeklyWeather) {
    const weatherList = weeklyWeather.daily;
    const forecastContainer = document.querySelector(".forecast__inner");

    forecastContainer.innerHTML = "";

    const currentWeatherContainer = document.querySelector(".current-weather");

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const currentDate = new Date(currentWeather.dt * 1000);

    const bgImg = require(`../assets/images/backgrounds/${currentWeather.weather[0].icon}.jpg`);
    document.body.style.backgroundImage = `url(${bgImg})`;

    currentWeatherContainer.innerHTML = `
        <div class="current-weather__left">
            <div class="current-weather__condition">
                <img class="current-weather__condition-icon" 
                     src="assets/images/conditions_icons/${currentWeather.weather[0].icon}.svg" 
                     alt="${currentWeather.weather[0].icon}"
                >
                <span class="current-weather__condition-description">${currentWeather.weather[0].description}</span>
            </div>
            <p class="current-weather__date">
                ${days[currentDate.getDay()]}, 
                ${months[currentDate.getMonth()]} 
                ${currentDate.getDate()}
            </p>
            <p class="current-weather__temp">${Math.round(currentWeather.main.temp)} <span class="current-weather__temp-unit">°C</span></p>
            <p class="current-weather__location">
                <span class="current-weather__city">${currentWeather.name}</span>,
                <span class="current-weather__country">${currentWeather.sys.country}</span>
            </p>
        </div>
        <div class="current-weather__right">
            <p class="current-weather__humidity">
                Humidity: <span class="current-weather__humidity-data">${currentWeather.main.humidity} %</span>
            </p>
            <p class="current-weather__pressure">
                Air pressure: <span class="current-weather__pressure-data">${currentWeather.main.pressure} hPa</span>
            </p>
            <p class="current-weather__visibility">
                Visibility: <span class="current-weather__visibility-data">${currentWeather.visibility} m</span>
            </p>
            <p class="current-weather__wspeed">
                Wind speed: <span class="current-weather__wspeed-data">${currentWeather.wind.speed} m/s</span>
            </p>
        </div>
    `;

    weatherList.forEach((day, index) => {
        if (index === 0) return;

        let date = new Date(day.dt * 1000);

        forecastContainer.innerHTML += `
            <div class="forecast__item">
                <p class="forecast__date">
                    ${days[date.getDay()]}, <wbr>
                    ${months[date.getMonth()]} 
                    ${date.getDate()}
                </p>
                <div class="forecast__icon-container">
                    <img class="forecast__icon" src="assets/images/conditions_icons/${day.weather[0].icon}.svg" alt="${day.weather[0].icon}">
                </div>
                <div class="forecast__temp">
                    <p class="forecast__temp-max">${Math.round(day.temp.max)}</p>
                    <p class="forecast__temp-min">${Math.round(day.temp.min)}</p>   
                </div> 
            </div>
        `;
    });
}

export default renderWeather;