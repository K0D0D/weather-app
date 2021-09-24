export function addLocation ({ position, city, country }) {
    let locationsArr = JSON.parse(localStorage.getItem("locations")) || [];

    position.lat = Number(position.lat);
    position.lon = Number(position.lon);

    const locationStringify = JSON.stringify(arguments[0]);

    locationsArr = locationsArr.filter(savedLocation => {
        return JSON.stringify(savedLocation) != locationStringify;
    });

    locationsArr.push(arguments[0]);

    localStorage.setItem("locations", JSON.stringify(locationsArr));
}

export function getLocations () {
    return JSON.parse(localStorage.getItem("locations"));
}

export function removeLocations () {
    localStorage.removeItem("locations");
}