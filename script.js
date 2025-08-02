// Grab DOM elements globally
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

const API_KEY = "efa6902cb41987f4af06b3d3d36ac4ce";

// Map numeric AQI to descriptive text
const aqiDescriptions = {
  1: "Good",
  2: "Fair",
  3: "Moderate",
  4: "Poor",
  5: "Very Poor",
};

// Helper function to format time in HH:MM AM/PM
function formatTime(date) {
  return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Fetch and update weather data
async function fetchWeatherData(city = "Paris") {
  try {
    // Show loading states
    temperatureElement.textContent = "...";
    conditionElement.textContent = "Loading...";
    alertsElement.textContent = "";
    aqiElement.textContent = "";
    sunriseElement.textContent = "--";
    windElement.textContent = "--";
    tempMinMaxElement.textContent = "-- / --";
    timeElement.textContent = "Loading time...";

    // Fetch weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    if (!weatherResponse.ok) throw new Error("City not found or API error");
    const weatherData = await weatherResponse.json();

    // Update weather info
    cityElement.textContent = weatherData.name;

    // Calculate local time in city using timezone offset
    const currentUtcTime = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
    const cityLocalTime = new Date(currentUtcTime + weatherData.timezone * 1000);
    timeElement.textContent = cityLocalTime.toLocaleString(undefined, {
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });

    temperatureElement.textContent = `${Math.round(weatherData.main.temp)}°C`;

    // Capitalize first letter of condition
    const conditionText = weatherData.weather[0].description;
    conditionElement.textContent = conditionText.charAt(0).toUpperCase() + conditionText.slice(1);

    sunriseElement.textContent = formatTime(new Date(weatherData.sys.sunrise * 1000));
    windElement.textContent = `${weatherData.wind.speed} m/s`;
    tempMinMaxElement.textContent = `${Math.round(weatherData.main.temp_min)}°C / ${Math.round(weatherData.main.temp_max)}°C`;

    // Update weather icon with HTTPS to prevent mixed content errors
    const iconCode = weatherData.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = conditionElement.textContent;

    // Fetch Air Quality Index data
    const aqiURL = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&appid=${API_KEY}`;
    const aqiResponse = await fetch(aqiURL);
    if (aqiResponse.ok) {
      const aqiData = await aqiResponse.json();
      const aqiValue = aqiData.list?.[0]?.main?.aqi || null;
      aqiElement.textContent = `Air Quality: ${aqiDescriptions[aqiValue] || "Unknown"}`;
    } else {
      aqiElement.textContent = "Air Quality: Data unavailable";
    }

    // Fetch Weather Alerts - One Call API (exclude unnecessary parts to save quota)
    const alertsUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}&exclude=current,minutely,hourly,daily&appid=${API_KEY}`;
    const alertsResponse = await fetch(alertsUrl);
    if (alertsResponse.ok) {
      const alertsData = await alertsResponse.json();
      if (alertsData.alerts && alertsData.alerts.length > 0) {
        alertsElement.textContent = alertsData.alerts[0].description;
      } else {
        alertsElement.textContent = "No alerts";
      }
    } else {
      alertsElement.textContent = "Alerts data unavailable";
    }
  } catch (error) {
    console.error("Error:", error);
    cityElement.textContent = "Error loading data";
    timeElement.textContent = "--";
    temperatureElement.textContent = "--";
    conditionElement.textContent = "Unavailable";
    sunriseElement.textContent = "--";
    windElement.textContent = "--";
    tempMinMaxElement.textContent = "-- / --";
    aqiElement.textContent = "--";
    alertsElement.textContent = "--";
    weatherIcon.src = "cloud.png";
    weatherIcon.alt = "Weather icon unavailable";
  }
}

// Fetch data when page loads
window.addEventListener("DOMContentLoaded", () => {
  fetchWeatherData(citySelectElement.value);
});

// Change city handler
citySelectElement.addEventListener("change", (event) => {
  const city = event.target.value;
  fetchWeatherData(city);
});
