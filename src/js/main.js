import "../index.html";
import "../scss/style.scss";
import "focus-visible";

import * as geolocation from "./geolocation";
import getWeather from "./getWeather";
import renderWeather from "./renderWeather";
import * as search from "./search";

document.addEventListener("DOMContentLoaded", () => {
    getInitialPosition();
    searchCity();
});

async function getInitialPosition () {
    const position = await geolocation.positionHandler();

    makeForecast(position);
}

async function makeForecast (position) {
    try {
        const [ currentWeather, weeklyWeather ] = await getWeather(position);

        renderWeather(currentWeather, weeklyWeather);
    } catch (err) {
        alert(err);
    }
}

function searchCity () {
    const searchForm = document.querySelector(".locations__search-form");
    const input = document.querySelector(".locations__search-input");

    let badValue;

    searchForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (isValid()) {
            const queryStr = input.value.trim();

            makeCall(queryStr);
        };
    });

    function isValid () {
        if (input.value.length < 3) {
            search.renderError("You must enter at least 3 characters");

            return false;
        } else if (input.value === badValue) {
            search.renderError("Not found");

            return false;
        } 

        return true;
    }

    async function makeCall () {
        try {
            const result = await search.getCities(input.value);

            checkResult(result);
        } catch (err) {
            console.log(err);
            search.renderError("Something went wrong :(");
        }
    }

    function checkResult (citiesData) {
        switch (citiesData.count) {
            case 0: 
                search.renderError("Not found");
                badValue = input.value;
                break;
            case 1: 
                console.log("there is one city: ", citiesData.list);
                makeForecast(citiesData.list[0].coord);
                break;
            default:
                console.log("there are several cities: ", citiesData.list);
                break;
        }
    }
} 