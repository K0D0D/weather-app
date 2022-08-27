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

    return position;
}

export function updateMap ({ lat, lon }) {
    const mapIframe = document.querySelector("#map-iframe");
    const apiKey = process.env.MAPS_API_KEY;

    mapIframe.src = "https://api.maptiler.com/maps/hybrid/"+
                    "?key=" + apiKey + "#14/" + 
                    lat + "/" + lon;
}