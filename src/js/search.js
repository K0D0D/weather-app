export async function getCities (value) {
    const apiKey = "3fe1069690ebca35a5e25a328d0074a0";
    const url = "https://api.openweathermap.org/data/2.5/find" +
                              "?q=" + value + 
                              "&cnt=50" +
                              "&units=metric" +
                              "&appid=" + apiKey;

    const response = await fetch(url);     
    const data = await response.json();

    return data;
}

export function renderError (errorText) {   
    const locationsContainer = document.querySelector(".locations__search-form");

    let errorElem = document.querySelector(".locations__search-error");

    if (errorElem) return;   

    errorElem = document.createElement("div");

    errorElem.className = "locations__search-error";
    errorElem.textContent = errorText;

    locationsContainer.appendChild(errorElem);

    setTimeout(() => {
        locationsContainer.removeChild(errorElem);
    }, 3000);
}