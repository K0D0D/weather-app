function getPosition () {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

export async function positionHandler () {
    let position = {};

    try {
        const response = await getPosition();

        position.lat = response.coords.latitude;
        position.lon = response.coords.longitude;

        localStorage.setItem("position", JSON.stringify(position));
    } catch (err) {
        if (!localStorage.getItem("position")) {
            position.lat = 51.507351;
            position.lon = -0.127758;
        } else {
            position = JSON.parse(localStorage.getItem("position"));
        }
    }
    
    updateMap(position);

    return position;
}

export function updateMap (locationObj) {
    const mapIframe = document.querySelector("#map-iframe") || document.createElement("iframe");

    if (!mapIframe.id) {
        mapIframe.id = "map-iframe";
        document.querySelector(".map").appendChild(mapIframe);
    }

    mapIframe.src = "https://maps.google.com/maps?q=" +
                    locationObj.lat + "," + 
                    locationObj.lon + 
                    "&z=11&output=embed";
}