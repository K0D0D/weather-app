import "../index.html";
import "../scss/style.scss";
import "focus-visible";

import * as geolocation from "./geolocation";
import getWeather from "./getWeather";

document.addEventListener("DOMContentLoaded", () => {
    getInitialPosition();
});

async function getInitialPosition () {
    const position = await geolocation.positionHandler();

    makeForecast(position);
}

async function makeForecast (position) {
    try {
        const [ currentWeather, weeklyWeather ] = await getWeather(position);

        console.log(currentWeather, weeklyWeather);
    } catch (err) {
        alert(err);
    }
}