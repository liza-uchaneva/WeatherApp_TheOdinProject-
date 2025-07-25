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

submitLocation();
// 
getWeatherData("Los Angeles");