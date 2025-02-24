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

  
    const weatherResponse =async () => {
      try {
        await fetch(weatherUrl);
        alert("success!");
      } catch (error) {
        
      }
      
    } 
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