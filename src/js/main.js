import "../index.html";
import "../scss/style.scss";
import "focus-visible";

import * as geolocation from "./geolocation";

document.addEventListener("DOMContentLoaded", () => {
    geolocation.positionHandler();
});

