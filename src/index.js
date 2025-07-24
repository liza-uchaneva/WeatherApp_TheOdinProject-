import "./style.css";
import {getWeatherData} from "./weatherApi.js"

const submitLocation = function () {
  let input = document.getElementById("location");
  let submitButton = document.getElementById("submit-location");
  submitButton.addEventListener("click", () => {
    getWeatherData(input.value);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      getWeatherData(input.value);
    }
  });
};
function openMapPicker() {
    document.getElementById("mapModal").style.display = "block";
    if (!map) {
        map = L.map("map").setView([20, 0], 2);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors"
        }).addTo(map);

    map.on("click", function (e) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
        const { lat, lng } = e.latlng;
        document.getElementById("locationInput").value = `${lat.toFixed(
        4
        )}, ${lng.toFixed(4)}`;
        closeMapPicker();
        });
    }
}

function closeMapPicker() {
    document.getElementById("mapModal").style.display = "none";
}

submitLocation();
getWeatherData("Los Angeles");