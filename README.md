# Weather App

This Weather App is a simple web application that displays the current weather information for a selected city. The app fetches data from the OpenWeatherMap API and updates the UI accordingly.

## Features

- Displays current weather information including temperature, weather condition, wind speed, and sunrise time.
- Allows users to select different cities from a dropdown menu.
- Shows additional details such as Air Quality Index (AQI) and weather alerts.

## Project Structure

```
weather-app/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Files

### index.html

This file contains the HTML structure of the Weather App.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Weather App</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="weather-app">
        <div class="header">
            <h1 id="city">Paris</h1>
            <div class="city-selector">
                <label for="city-select">Choose a city:</label>
                <select id="city-select">
                    <option value="Paris">Paris</option>
                    <option value="London">London</option>
                    <option value="New York">New York</option>
                    <option value="Tokyo">Tokyo</option>
                </select>
            </div>
            <p id="time">Tuesday 9:00 AM</p>
        </div>
        <div class="weather-card">
            <div class="weather-icon">
                <img src="cloud.png" alt="Cloud Icon" id="weather-icon">
                <h2 id="temperature">55°C</h2>
            </div>
            <div class="weather-info">
                <p id="condition">Rain Shower</p>
            </div>
        </div>
        <div class="details">
            <div>
                <p>Sunrise</p>
                <p id="sunrise">6:00</p>
            </div>
            <div>
                <p>Wind</p>
                <p id="wind">10 m/s</p>
            </div>
            <div>
                <p>Temperature</p>
                <p id="temp-min-max">49°C</p>
            </div>
            <div>
                <p>Air Quality Index</p>
                <p id="aqi">Good</p>
            </div>
            <div>
                <p>Weather Alerts</p>
                <p id="alerts">No alerts</p>
            </div>
        </div>
    </div>
    <script src="script.js"></script>
</body>
</html>
```

### styles.css

This file contains the CSS styles for the Weather App.

```css
body {
    font-family: 'Arial', sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background-color: #e8f5fd;
}

.weather-app {
    text-align: center;
    background: #ffffff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    width: 300px;
}

.header {
    margin-bottom: 20px;
}

.weather-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
}

.weather-icon {
    position: relative;
}

.weather-icon img {
    width: 80px;
    height: 80px;
}

.weather-icon h2 {
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    font-size: 1.5rem;
    color: #333;
}

.weather-info {
    text-align: center;
    margin-top: 40px;
}

.weather-info p {
    margin: 0;
    font-size: 0.9rem;
    color: #777;
}

.details {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 0 10px;
    font-size: 0.8rem;
    color: #555;
}

.details div {
    width: 48%;
    margin-bottom: 10px;
}

.details div p:first-child {
    font-weight: bold;
    margin: 0;
}

.details div p:last-child {
    margin: 0;
}

.city-selector {
    margin-bottom: 10px;
}
```

### script.js

This file contains the JavaScript code to fetch weather data from the OpenWeatherMap API and update the UI.

```javascript
const cityElement = document.getElementById("city");
const timeElement = document.getElementById("time");
const temperatureElement = document.getElementById("temperature");
const conditionElement = document.getElementById("condition");
const sunriseElement = document.getElementById("sunrise");
const windElement = document.getElementById("wind");
const tempMinMaxElement = document.getElementById("temp-min-max");
const weatherIcon = document.getElementById("weather-icon");
const citySelectElement = document.getElementById("city-select");
const aqiElement = document.getElementById("aqi");
const alertsElement = document.getElementById("alerts");

// Fetch weather data from OpenWeatherMap API
const fetchWeatherData = async (city = "Paris") => {
    const apiKey = "efa6902cb41987f4af06b3d3d36ac4ce"; // Directly use the API key
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        // Update the UI with fetched weather data
        cityElement.textContent = weatherData.name;
        timeElement.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        temperatureElement.textContent = `${Math.round(weatherData.main.temp)}°C`;
        conditionElement.textContent = weatherData.weather[0].description;
        sunriseElement.textContent = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        windElement.textContent = `${weatherData.wind.speed} m/s`;
        tempMinMaxElement.textContent = `${Math.round(weatherData.main.temp_min)}°C / ${Math.round(weatherData.main.temp_max)}°C`;

        // Change weather icon dynamically
        const iconCode = weatherData.weather[0].icon;
        weatherIcon.src = `http://openweathermap.org/img/wn/${iconCode}@2x.png`;

        // Fetch AQI data
        const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`;
        const aqiResponse = await fetch(aqiUrl);
        const aqiData = await aqiResponse.json();
        aqiElement.textContent = `AQI: ${aqiData.list[0].main.aqi}`;

        // Fetch Weather Alerts data
        const alertsUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${apiKey}`;
        const alertsResponse = await fetch(alertsUrl);
        const alertsData = await alertsResponse.json();
        if (alertsData.alerts && alertsData.alerts.length > 0) {
            alertsElement.textContent = alertsData.alerts[0].description;
        } else {
            alertsElement.textContent = "No alerts";
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
};

// Call the function to fetch weather data on page load
fetchWeatherData();

// Add event listener to city select dropdown
citySelectElement.addEventListener("change", (event) => {
    fetchWeatherData(event.target.value);
});
```

## How to Run

1. Clone the repository.
2. Open `index.html` in your web browser.
3. Select a city from the dropdown menu to view the current weather information.

## Dependencies

- OpenWeatherMap API

## License

This project is licensed under the MIT License.