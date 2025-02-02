const apiKey = "d0226124694b191c3e4ac8ac097a3477"; // Replace with your OpenWeatherMap API key

// Function to get the 7-day weather forecast
async function getWeatherForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.cod === "200") {
            displayForecast(data);
        } else {
            document.getElementById("weatherResult").innerHTML = `<p>Unable to fetch forecast data.</p>`;
        }
    } catch (error) {
        console.error("Error fetching weather forecast:", error);
        document.getElementById("weatherResult").innerHTML = `<p>Something went wrong. Please try again.</p>`;
    }
}

// Function to fetch user's location and get the weather forecast
function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                getWeatherForecast(latitude, longitude);
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

// Function to display the 7-day forecast
function displayForecast(data) {
    let dailyForecasts = {}; 

    // OpenWeatherMap provides data at 3-hour intervals, so we group it by day
    data.list.forEach((entry) => {
        const date = entry.dt_txt.split(" ")[0]; // Extract date (YYYY-MM-DD)
        if (!dailyForecasts[date]) {
            dailyForecasts[date] = {
                tempSum: 0,
                count: 0,
                minTemp: entry.main.temp_min,
                maxTemp: entry.main.temp_max,
                weather: entry.weather[0].description,
                icon: entry.weather[0].icon,
            };
        }
        dailyForecasts[date].tempSum += entry.main.temp;
        dailyForecasts[date].count += 1;
        dailyForecasts[date].minTemp = Math.min(dailyForecasts[date].minTemp, entry.main.temp_min);
        dailyForecasts[date].maxTemp = Math.max(dailyForecasts[date].maxTemp, entry.main.temp_max);
    });

    // Get the first 7 days from the forecast
    let forecastHTML = "<h2>7-Day Weather Forecast</h2>";
    Object.keys(dailyForecasts)
        .slice(0, 7) // Take the first 7 days
        .forEach((date) => {
            const dayData = dailyForecasts[date];
            const avgTemp = (dayData.tempSum / dayData.count).toFixed(1);
            forecastHTML += `
                <div style="border: 1px solid #ddd; padding: 10px; margin: 5px; border-radius: 8px;">
                    <h3>${date}</h3>
                    <p>🌡️ Avg Temp: ${avgTemp}°C</p>
                    <p>🔻 Min: ${dayData.minTemp.toFixed(1)}°C | 🔺 Max: ${dayData.maxTemp.toFixed(1)}°C</p>
                    <p>🌦️ ${dayData.weather}</p>
                    <img src="https://openweathermap.org/img/wn/${dayData.icon}.png" alt="Weather Icon">
                </div>
            `;
        });

    document.getElementById("weatherResult").innerHTML = forecastHTML;
}

// Call getUserLocation on page load
window.onload = getUserLocation;
