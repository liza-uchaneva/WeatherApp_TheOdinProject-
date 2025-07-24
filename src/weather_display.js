import { weatherNow, weatherDaily, weatherHourly } from './weather_data_processing.js';

export function displayTodayWeather(today) {
  const box = document.getElementById('today-weather');
  box.innerHTML = `
    <h2>${today.address}</h2>
    <div class="weather-summary">
      <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${today.icon}.png" alt="${today.conditions}" class="weather-icon">
      <div class="weather-info">
        <p><strong>${today.description}</strong></p>
        <p>🌡️ Temp: ${today.temp}°C (feels like ${today.feelslike}°C)</p>
        <p>🔺 Max: ${today.tempmax}°C | 🔻 Min: ${today.tempmin}°C</p>
        <p>☁️ Conditions: ${today.conditions}</p>
      </div>
    </div>
  `;
}

export function displayDailyWeather(data) {
  const daily = weatherDaily(data);
  const container = document.getElementById('daily-weather');

  container.innerHTML = `
    <div class="daily-forecast-list">
      ${daily
        .slice(0, 7)
        .map(day => {
          const date = new Date(day.datetime).toLocaleDateString(undefined, {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
          });

          return `
            <div class="daily-card">
              <div class="day">${date}</div>
              <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${day.icon}.png" alt="${day.conditions}" class="icon">
              <div class="temps">
                <span class="max">🔺 ${day.tempmax}°C</span>
                <span class="min">🔻 ${day.tempmin}°C</span>
              </div>
              <div class="condition">${day.conditions}</div>
            </div>
          `;
        })
        .join('')}
    </div>`;
}

export function displayHourlyWeather(data) {
  const hourlyData = weatherHourly(data);
  const container = document.getElementById('hourly-weather');

  container.innerHTML = `
    <div class="hourly-forecast-scroll">
      ${Object.values(hourlyData)
        .slice(0, 12) // Display first 12 hours only
        .map(hour => {
          const time = new Date(`1970-01-01T${hour.datetime}`).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          });

          return `
            <div class="hourly-card">
              <div class="time">${time}</div>
              <img
                src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${hour.icon}.png"
                alt="${hour.conditions}"
                class="icon"
              >
              <div class="temp">${hour.temp}°C</div>
              <div class="condition">${hour.conditions}</div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}

export function renderHourlyTemperatureChart(data) {
  const hourly = weatherHourly(data);
  const hours = Object.values(hourly).slice(0, 8);

  const labels = hours.map(h =>
    new Date(`1970-01-01T${h.datetime}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  );
  const temps = hours.map(h => h.temp);

  const ctx = document.getElementById('hourlyTempChart').getContext('2d');

  if (window.hourlyChart) {
    window.hourlyChart.destroy();
  }

  window.hourlyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temps,
          backgroundColor: 'rgba(0, 119, 255, 0.1)',
          borderColor: '#0077ff',
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.3,
          fill: true,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Hour',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Temperature (°C)',
          },
          beginAtZero: false,
        },
      },
    },
  });
}