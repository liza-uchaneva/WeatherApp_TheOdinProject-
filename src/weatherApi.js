import {key} from "./key.js";
import { weatherNow } from "./weather_data_processing.js";
import { displayTodayWeather, displayDailyWeather, 
         displayHourlyWeather, renderHourlyTemperatureChart } from "./weather_display.js"

export async function getWeatherData(location) {
  try {
    if (!location.trim()) {
      throw new Error("location cannot be empty");
    }

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=${key}`,
      {
        mode: "cors",
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Unknown API error");
    }
    localStorage.setItem("location", data.resolvedAddress);
    const today = weatherNow(data);
    displayTodayWeather(today);
    displayDailyWeather(data);
    displayHourlyWeather(data);
    renderHourlyTemperatureChart(data);
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        alert(error.message);
    } finally {
    }
}