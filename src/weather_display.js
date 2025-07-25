import { weatherNow, weatherDaily, weatherHourly } from './weather_data_processing.js';

export function displayTodayWeather(today) {
  const box = document.getElementById('today-weather');
  box.innerHTML = `
    <div class="weather-summary">
      <div class="head">
        <h2>${today.address}</h2>
        <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${today.icon}.png" alt="${today.conditions}" class="weather-icon">
      </div>
      <div class="weather-info">
        <p><strong>${today.description}</strong></p>
        <p>Temp: ${today.temp}°C (feels like ${today.feelslike}°C)</p>
        <p>Max: ${today.tempmax}°C | Min: ${today.tempmin}°C</p>
        <p>Conditions: ${today.conditions}</p>
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
                <p class="max"> ${day.tempmax}°C</p>
                <p class="min"> ${day.tempmin}°C</p>
              </div>
            </div>
          `;
        })
        .join('')}
    </div>`;
}

export function displayHourlyWeather(data) {
  const hourlyData = Object.values(weatherHourly(data));
  const container = document.getElementById('hourly-weather');

  const currentHour = new Date().getHours();

  // Find index of current hour in the data
  const startIndex = hourlyData.findIndex(h => {
    const hour = parseInt(h.datetime.split(':')[0], 10);
    return hour === currentHour;
  });

  const upcomingHours = hourlyData.slice(startIndex, startIndex + 12);

  container.innerHTML = `
    <div class="hourly-forecast-scroll">
      ${upcomingHours
        .map(hour => {
          const time = new Date(`1970-01-01T${hour.datetime}`).toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          });

          return `
            <div class="hourly-card">
              <div class="time">${time}</div>
              <img
                src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${hour.icon}.png"
                alt="${hour.conditions}"
                class="icon"
              >
              <div class="temp"><p>${hour.temp}°C</p></div>
            </div>
          `;
        })
        .join('')}
    </div>
  `;
}


export function renderHourlyTemperatureChart(data) {
  const hourlyData = Object.values(weatherHourly(data));
  const currentHour = new Date().getHours();

  const startIndex = hourlyData.findIndex(h => {
    const hour = parseInt(h.datetime.split(':')[0], 10);
    return hour === currentHour;
  });

  const hours = hourlyData.slice(startIndex, startIndex + 8);

  const labels = hours.map(h =>
    new Date(`1970-01-01T${h.datetime}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
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
      plugins: {
        legend: {
          labels: {
            font: {
              family: 'Karla',
              weight: '400',
              size: 14,
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            font: {
              family: 'Karla',
              weight: '200',
              size: 14,
            },
          },
          ticks: {
            font: {
              family: 'Karla',
              weight: '200',
              size: 16,
            },
          },
        },
        y: {
          title: {
            display: true,
            text: 'Temperature (°C)',
            font: {
              family: 'Karla',
              weight: '200',
              size: 16,
            },
          },
          ticks: {
            font: {
              family: 'Karla',
              weight: '200',
              size: 16,
            },
          },
        },
      },
    },
  });
}
