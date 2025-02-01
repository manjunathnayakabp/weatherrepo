const apiKey = "d0226124694b191c3e4ac8ac097a3477"; // Replace with your OpenWeatherMap API key

//const apiKey = "YOUR_API_KEY"; // Replace with your OpenWeatherMap API key

// Function to get weather by latitude and longitude
async function getWeatherByLocation(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === 200) {
            displayWeather(data);
        } else {
            document.getElementById("weatherResult").innerHTML = `<p>Unable to fetch weather data.</p>`;
        }
    } catch (error) {
        console.error("Error fetching weather data:", error);
        document.getElementById("weatherResult").innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
}

// Function to fetch user's location and get weather
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherByLocation(latitude, longitude);
            },
            (error) => {
                console.error("Error getting location:", error);
                document.getElementById("weatherResult").innerHTML = `<p>Location access denied. Enable location services or refresh the page.</p>`;
            }
        );
    } else {
        document.getElementById("weatherResult").innerHTML = `<p>Geolocation is not supported by this browser.</p>`;
    }
}

// Function to display weather data
function displayWeather(data) {
    const weatherHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>🤔 Feels Like: ${data.main.feels_like}°C</p>
        <p>💨 Wind Speed: ${data.wind.speed} m/s</p>
        <p>🌦️ Weather: ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="Weather Icon">
    `;
    document.getElementById("weatherResult").innerHTML = weatherHTML;
}

// Call getUserLocation on page load
window.onload = getUserLocation;
