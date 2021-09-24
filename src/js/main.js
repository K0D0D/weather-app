import "../index.html";
import "../scss/style.scss";
import "focus-visible";

import * as geolocation from "./geolocation";
import getWeather from "./getWeather";
import renderWeather from "./renderWeather";
import * as search from "./search";
import Modal from "./Modal";
import * as locations from "./locationsStorage";

document.addEventListener("DOMContentLoaded", () => {
    getInitialPosition();
    searchCity();
    savedLocations();
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
    const locationsContainer = document.querySelector(".locations");

    const citiesModal = new Modal({
        modifier: "modal--cities", 
        title: "Matches"
    });

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
        lockSearch();

        try {
            const result = await search.getCities(input.value);

            checkResult(result);
        } catch (err) {
            search.renderError("Something went wrong :(");
        }
    }

    function checkResult (citiesData) {
        switch (citiesData.count) {
            case 0: 
                search.renderError("Not found");
                badValue = input.value;
                unlockSearch();

                break;
            case 1: 
                makeForecast(citiesData.list[0].coord);

                locations.addLocation({
                    position: citiesData.list[0].coord,
                    city: citiesData.list[0].name,
                    country: citiesData.list[0].sys.country
                });

                unlockSearch();

                break;
            default:
                createMarkup(citiesData.list);

                break;
        }
    }

    function lockSearch () {
        locationsContainer.classList.add("locations--inactive");
    }

    function unlockSearch () {
        locationsContainer.classList.remove("locations--inactive");
    }

    function createMarkup (citiesList) {
        const citiesContainer = document.createElement("div");

        citiesList.forEach(city => {
            citiesContainer.innerHTML += `
                <button class="modal__item">
                    <div class="modal__item-top">
                        <span class="modal__item-city">${city.name}</span>
                        <span class="modal__item-country">${city.sys.country}</span>
                    </div>
                    <div class="modal__item-bottom">
                        <span class="modal__item-lat">${city.coord.lat}</span>, 
                        <span class="modal__item-lon">${city.coord.lon}</span>
                    </div>
                </button>
            `;
        });

        citiesModal.render(citiesContainer.innerHTML);
        enableSelection();
        unlockSearch();
    }
    
    function enableSelection () {
        const citiesElements = document.querySelectorAll(".modal--cities .modal__item");

        citiesElements.forEach(cityElement => {
            cityElement.addEventListener("click", selectCity);
        });
    }

    function selectCity () {
        const elem = this;

        const position = {
            lat: elem.querySelector(".modal__item-lat").innerText,
            lon: elem.querySelector(".modal__item-lon").innerText
        };

        locations.addLocation({
            position: position,
            city: elem.querySelector(".modal__item-city").innerText,
            country: elem.querySelector(".modal__item-country").innerText
        });

        makeForecast(position);
        geolocation.updateMap(position);
        citiesModal.close();
        input.focus();
    }
}

function savedLocations () {
    const btn = document.querySelector(".locations__recent");
    
    const savedModal = new Modal({
        modifier: "modal--recent",
        title: "Saved Locations"
    });

    btn.addEventListener("click", createMarkup);

    function createMarkup () {
        const locationsList = locations.getLocations();
        const locationsContainer = document.createElement("div");
        const messageElem = document.createElement("div");
        const deleteLocationsBtn = document.createElement("button");

        messageElem.innerHTML = `
            <div class="modal__message">
                You don't have any saved cities
            </div>
        `;

        if (!locationsList) {
            savedModal.render(messageElem.innerHTML);

            return;
        }

        deleteLocationsBtn.className = "modal__item item--delete";
        deleteLocationsBtn.innerText = "Remove all locations";

        locationsContainer.appendChild(deleteLocationsBtn);

        locationsList.forEach(location => {
            locationsContainer.innerHTML += `
                <button class="modal__item">
                    <div class="modal__item-top">
                        <span class="modal__item-city">${location.city}</span>
                        <span class="modal__item-country">${location.country}</span>
                    </div>
                    <div class="modal__item-bottom">
                        <span class="modal__item-lat">${location.position.lat}</span>, 
                        <span class="modal__item-lon">${location.position.lon}</span>
                    </div>
                </button>
            `;
        });

        savedModal.render(locationsContainer.innerHTML);

        enableSelection();
    }

    function enableSelection () {
        const citiesElements = document.querySelectorAll(".modal--recent .modal__item:not(.item--delete)");
        const deleteElementsBtn = document.querySelector(".modal--recent .item--delete");

        citiesElements.forEach(cityElement => {
            cityElement.addEventListener("click", selectCity);
        });

        deleteElementsBtn.addEventListener("click", () => {
            locations.removeLocations();

            savedModal.close();
            btn.focus();
        });
    }

    function selectCity () {
        const elem = this;

        const position = {
            lat: elem.querySelector(".modal__item-lat").innerText,
            lon: elem.querySelector(".modal__item-lon").innerText
        };

        makeForecast(position);
        savedModal.close();
        btn.focus();
    }
}